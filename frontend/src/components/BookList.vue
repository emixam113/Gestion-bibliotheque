<template>
  <div>
    <h2>Liste des livres</h2>

    <!-- Barre de recherche -->
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="Rechercher un livre..." 
      @input="applyFilters"
    />

    <!-- Filtres -->
    <div>
      <label>Disponibilité :</label>
      <select v-model="selectedAvailability" @change="applyFilters">
        <option value="">Tous</option>
        <option value="true">Disponible</option>
        <option value="false">Indisponible</option>
      </select>

      <label>Catégorie :</label>
      <select v-model="selectedCategory" @change="applyFilters">
        <option value="">Toutes</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <ul>
      <li v-for="book in filteredBooks" :key="book.id">
        <strong>{{ book.title }}</strong> par {{ book.author }}
        <span v-if="book.is_available" style="color: green;">- Disponible</span>
        <span v-else style="color: red;">- Indisponible</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      searchQuery: '',
      selectedAvailability: '',
      selectedCategory: '',
      filteredBooks: [],
      categories: [] // Liste des catégories
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await fetch('http://localhost:3000/books');
        const data = await response.json();
        this.books = data;
        this.filteredBooks = data;
        this.extractCategories();
      } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
      }
    },
    extractCategories() {
      // Récupère les catégories uniques des livres
      this.categories = [...new Set(this.books.map(book => book.category))];
    },
    applyFilters() {
      this.filteredBooks = this.books.filter(book => {
        const matchesSearch = 
          book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesAvailability = 
          this.selectedAvailability === '' || 
          book.is_available.toString() === this.selectedAvailability;
        const matchesCategory = 
          this.selectedCategory === '' || 
          book.category === this.selectedCategory;

        return matchesSearch && matchesAvailability && matchesCategory;
      });
    }
  }
};
</script>
