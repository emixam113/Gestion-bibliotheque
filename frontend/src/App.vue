<template>
  <div id="app">
    <AddBook/>
    <BookList/>
  
  </div>
</template>

<script>
import AddBook from './components/AddBook.vue'
import BookList from './components/BookList.vue'

export default {
  name: 'App',
  components: {
    AddBook,
    BookList,
  },
};
</script>