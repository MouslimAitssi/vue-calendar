<template>
  <div>
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
    <div v-for="row in rows" :key="'value' + row">
      <h5>Total des {{row}}: {{countValues(row)}}</h5>
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
  export default {
    name: 'BasicTable',
    data () {
      return {
        //Number of days depends on month
        NUMBER_OF_DAYS: 31,

        days: [],

        //The weekends are configurable here
        weekends: [6, 7, 13, 14, 20, 21, 27, 28],

        //The this.rows are configurable here
        rows: [ 'Missions', 'Congés', 'Maladies' ],

        values: [],

        isSnackbarOpen: false,
        snackbarTimeout: 1000,
        snackbarText: 'Impossible de sélectionner cette case'
      }
    },
    created() {
      this.fillvaluesWithZeros();
      for (let i = 1; i <= this.NUMBER_OF_DAYS; i++) {
        this.days.push(i);
      }
    },
    methods: {
      isSelectable(row, day){
        if(!this.isWeekend(day)) {
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
          for (let i = 1; i <= this.NUMBER_OF_DAYS; i++) {
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
        if (!this.weekends.includes(day)) {
          return false;
        }
        return true;
      },

      selectAll(row) {
        //let vals = Object.create(this.values);
        for (let index = 0; index < this.values.length; index++) {
          if(this.values[index][0] === row) {
            for (let i = 1; i <= this.NUMBER_OF_DAYS; i++) {
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
            for (let i = 0; i < this.NUMBER_OF_DAYS; i++) {
              if(this.getValue(row, i)) {
                c = c + this.getValue(row, i);
              }
            }
            return c;
          }
        }
      },

      sendInfos() {
        console.log(this.values);
      }
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

</style>
