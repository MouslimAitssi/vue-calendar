<template>
  <div id="app">
    <BasicTable :injectedData="this.checkInjectedData()"/>
  </div>
</template>

<script>
  import BasicTable from './components/BasicTable.vue';

  export default {
    name: 'App',
    components: {
      BasicTable
    },

    data: () => ({
      
      //The rows are configurable here
      injectedData: {
        rows: [ 'Mission', 'Congés', 'Maladies' ],        
        user_name: "user name",
        mission_id: "mission id",
        start_at: 1,
        end_at: 31,
        weekends: [6, 7, 13, 14, 20, 21, 27, 28],        
        values: {
          'Mission': { '1': 1, '2': 1, '3': 1, '4': 0, '5': 0, '6': 0, '7': 0, '8': 1, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, '18': 0, '19': 0, '20': 0, '21': 0, '22': 0, '23': 0, '24': 0, '25': 0, '26': 0, '27': 0, '28': 0, '29': 0, '30': 0, '31': 0 },          
          'Congés': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 1, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, '18': 0, '19': 0, '20': 0, '21': 0, '22': 0, '23': 0, '24': 0, '25': 0, '26': 0, '27': 0, '28': 0, '29': 0, '30': 0, '31': 0 },          
          'Maladies': { '1': 0 , '2': 0 , '3': 0 , '4': 0 , '5': 0 , '6': 0 , '7': 0 , '8': 0 , '9': 0 , '10': 0 , '11': 0 , '12': 0 , '13': 0 , '14': 0 , '15': 0 , '16': 0 , '17': 0 , '18': 0 , '19': 0 , '20': 0 , '21': 0 , '22': 0 , '23': 0 , '24': 0 , '25': 0 , '26': 0 , '27': 0 , '28': 0 , '29': 0 , '30': 0 , '31': 0 },        
        },
        mode: "edit",//create, edit, review
        user_id: "5"
      },
    }),

    methods: {
      checkInjectedData() {
        if(this.injectedData) {
          return this.injectedData;
        }
        return null;
      }
    }
  };
</script>
