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
          'Mission': [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Congés': [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Maladies': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        mode: "create",//create, edit, review
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
