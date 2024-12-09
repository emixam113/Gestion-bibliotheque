<template>
  <div id="app">
    <AddBook/>
    <BookList/>
    <AvailableChart/>
  
  </div>
</template>

<script>
import AddBook from './components/AddBook.vue'
import BookList from './components/BookList.vue'

import AvailableChart from './components/AvailableChart.vue';

export default {
  name: 'App',
  components: {
    AddBook,
    BookList,
    AvailableChart,
  },
};
</script>