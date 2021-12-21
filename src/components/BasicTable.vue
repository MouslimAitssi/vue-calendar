<template>
  <div>
    <h4>{{this.injectedData.mode}} mode:</h4>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th></th>
            <th v-for="day in days" :key="day" class="text-left">
              {{day}}
            </th>
            <th>
              Sélectionner tout
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row"
          >
            <td>{{row}}</td>
            <td
              v-for="day in days"
              :key="row + day"
              @click="select(row, day)"
              v-bind:class="(isWeekend(day) ? 'gray-cell' : '') + ' ' + (getValue(row, day) !== ''&&!isWeekend(day) ? 'selected-cell' : '')"
            >
              {{ getValue(row, day) }}
            </td>
            <td @click="selectAll(row)"></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <span>Justificatif:</span>
    <vue-dropzone ref="justif" id="justif" :options="dropzoneOptions"
    @vdropzone-success="successJustif"
    @vdropzone-error="errorJustif"
    @vdropzone-removed-file="removedJustif"
    ></vue-dropzone>
    <div v-if="this.errorJustifMessage" class="error-message">
      {{this.errorJustifMessage}}<br/>
    </div>
    <div v-for="row in rows" :key="'value' + row">
      <span>Total pour {{row}}: </span><h5>{{countValues(row)}}</h5>
    </div>
    <button class="btn btn-success" @click="sendInfos()">Envoyer</button>
    <v-snackbar
      v-model="isSnackbarOpen"
      :timeout="snackbarTimeout"
    >
      {{snackbarText}}
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios';
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'
  export default {
    name: 'BasicTable',
    props: {
      /* start_at: Number,
      end_at: Number,
      user_id: String,
      user_name: String,
      mission_id: String,
      weekends: Array,
      rows: Array,
      mode: String, */
      injectedData: Object
    },
    components: {
      vueDropzone: vue2Dropzone
    },
    data () {
      return {
        days: [],
        values: [],
        isSnackbarOpen: false,
        snackbarTimeout: 1000,
        snackbarText: 'Impossible de sélectionner cette case',
        justif: "",
        errorJustifMessage: "",
        dropzoneOptions: {
          url: 'https://httpbin.org/post',
          maxFilesize: 3,//mb
          //headers: {  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
          //acceptedFiles : 'application/pdf,image/jpeg,image/png,image/gif',
          params: { size: 10 },
          thumbnailWidth: 75,
          thumbnailHeight: 75,
          uploadMultiple: false,
          addRemoveLinks: true,
          dictRemoveFile : '<i class="fas fa-trash"> Supprimer le fichier</i>' ,
          maxFiles:1,
          init: function() {
                this.on("maxfilesexceeded", function(file) {
                      this.removeAllFiles();
                      this.addFile(file);
                });
                this.on('error', function(file, message) {
                  this.errorJustifMessage=message;
                  this.removeFile(file);
                });
                this.on('resetFiles', function() {
                    if(this.files.length != 0){
                        for(let i=0; i<this.files.length; i++){
                            this.files[i].previewElement.remove();
                        }
                        this.files.length = 0;
                    }
                });
          },
          dictDefaultMessage: "Cliquez et sélectionnez les fichiers ou faites-les glisser et déposez-les ici.",
          dictFallbackMessage: "Votre navigateur ne prend pas en charge le glisser-déposer de fichiers.",
          dictFallbackText: "Utilisez le formulaire ci-dessous pour télécharger vos fichiers.",
          dictFileTooBig: "Le fichier est trop volumineux ({{filesize}}MiB). Taille maximale du fichier : {{maxFilesize}}MiB.",
          dictInvalidFileType: "Vous ne pouvez pas télécharger des fichiers de ce type.",
          dictResponseError: "Code de réponse du serveur: {{statusCode}}.",
          dictCancelUpload: "Abandonner le chargement",
          dictUploadCanceled: "Chargement interrompu.",
          dictCancelUploadConfirmation: "Vous êtes sûr de vouloir interrompre le téléchargement?",
          dictRemoveFileConfirmation: null,
          dictMaxFilesExceeded: "Vous ne pouvez pas télécharger plus de fichiers."
        }
      }
    },
    created() {
      console.log(this.injectedData);
      this.rows = this.injectedData.rows;
      if(this.injectedData.mode !=="create") {
        Object.keys(this.injectedData.values).forEach((key) => {
          this.values.push([key, this.injectedData.values[key]]);
        })
        console.log(this.values);
      }
      else {
        this.fillvaluesWithZeros();
      }
      for (let i = this.injectedData.start_at; i <= this.injectedData.end_at; i++) {
        this.days.push(i);
      }
    },
    methods: {
      isSelectable(row, day){
        if(!this.isWeekend(day)&&this.injectedData.mode!=="review") {
          let arr = this.rows.filter(item => item !== row);
          for (let i = 0; i < arr.length; i++) {
            if(this.getValue(arr[i], day) !=='') {
              return false;
            }
          }
          return true;
        }
        return false;
      },

      fillvaluesWithZeros() {
        this.rows.map((row) => {
          let arr = []
          for (let i = this.injectedData.start_at; i <= this.injectedData.end_at; i++) {
            arr.push(0)
          }
          this.values.push([row, arr]);
        });
      },

      getValue(row, day) {
          for (let index = 0; index < this.values.length; index++) {
            if(this.values[index][0] === row) {
              if(this.values[index][1][day - 1] !==0) {
                return this.values[index][1][day - 1];
              }
              // Rendering blank rather than 0
              return '';
            }
          }
          return '';
      },

      nextValue(prevValue) {
        switch (prevValue) {
          case 0:
            return 1;
          case 1:
            return 0.5;
          case 0.5:
            return 1.5;
          case 1.5:
            return 0;
          default:
            return 0;
        }
      },
      
      toggle(row, day) {
          let vals = Object.create(this.values);
          for (let index = 0; index < vals.length; index++) {
            if(this.values[index][0] === row) {
              vals[index][1][day - 1] = this.nextValue(vals[index][1][day - 1]);
              break;
            }
          }
          this.values = vals;
      },

      select(row, day) {
        if(this.isSelectable(row, day)) {
          this.toggle(row, day);
        }
        else {
          this.isSnackbarOpen = true;
        }
      },

      isWeekend(day) {
        if (!this.injectedData.weekends.includes(day)) {
          return false;
        }
        return true;
      },

      selectAll(row) {
        for (let index = 0; index < this.values.length; index++) {
          if(this.values[index][0] === row) {
            for (let i = this.injectedData.start_at; i <= this.injectedData.end_at; i++) {
              this.select(row, i)
            }
            break;
          }
        }
      },

      countValues(row) {
        let c = 0;
        for (let index = 0; index < this.values.length; index++) {
          if(this.values[index][0] === row) {
            for (let i = this.injectedData.start_at; i <= this.injectedData.end_at; i++) {
              if(this.getValue(row, i)) {
                c = c + this.getValue(row, i);
              }
            }
            return c;
          }
        }
      },

      sendInfos() {
        console.log("values: ", this.values);
        let formData = new FormData();
        this.values.forEach((row) => {
          formData.append(row[0], row[1]);
        })
        formData.append("mission id: ", this.injectedData.mission_id);
        formData.append("user id: ", this.injectedData.user_id);
        formData.append("user name: ", this.injectedData.user_name);
        axios({
          method: 'post',
          url: 'https://httpbin.org/post',
          data: formData
        }).then((res)=> {
          console.log(res.data.form);
        });
      },
      successJustif(file, res) {
          this.justif = res.name;
          this.errorJustifMessage="";
      },
      errorJustif(file, message) {
        //file.previewElement.remove();
        this.errorJustifMessage = message;
      },
      removedJustif() {
        //file.previewElement.remove();
        this.justif = "";
      },
    }
  }
</script>

<style>
  .gray-cell {
    background-color: gray;
  }

  .selected-cell {
    background-color: greenyellow;
  }

  .btn {
    position: absolute;
    right: 1%;
    bottom: 1%;
  }

  .error-message { color: #ff0644; }

</style>
