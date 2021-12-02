<template>
  <div id="app">
    <BasicTable :start_at="this.start_at" :end_at="this.end_at" :mission_id="this.mission_id" :user_id="this.user_id" :user_name="this.user_name" :weekends="this.weekends"/>
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
      user_id: "user id",
      user_name: "user name",
      mission_id: "mission id",
      start_at: 1,
      end_at: 10,
      weekends: [6, 7, 13, 14, 20, 21, 27, 28],
    }),
  };
</script>
