<template>
  <div>
    <h2>Liste des livres</h2>

    <!-- Formulaire de modification de livre (affiché lorsqu'un livre est sélectionné) -->
    <div v-if="editingBook">
      <h3>Modifier le livre</h3>
      <form @submit.prevent="updateBook">
        <div>
          <label for="title">Titre</label>
          <input v-model="editingBook.title" id="title" placeholder="Titre" required />
        </div>
        <div>
          <label for="author">Auteur</label>
          <input v-model="editingBook.author" id="author" placeholder="Auteur" required />
        </div>
        <div>
          <label for="category">Catégorie</label>
          <input v-model="editingBook.category" id="category" placeholder="Catégorie" required />
        </div>
        <div>
          <label for="is_available">Disponible:</label>
          <input type="checkbox" v-model="editingBook.is_available" id="is_available" />
        </div>
        <button type="submit">Mettre à jour</button>
        <button @click="cancelEdit" type="button">Annuler</button>
      </form>
    </div>

    <!-- Barre de recherche -->
    <input v-model="searchQuery" type="text" placeholder="Rechercher un livre..." @input="applyFilters" />

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

      <button @click="resetFilters">Effacer les filtres</button>
    </div>

    <!-- Liste des livres -->
    <div v-if="filteredBooks.length === 0">Aucun livre ne correspond à vos critères.</div>
    <ul>
      <li v-for="book in filteredBooks" :key="book.id">
        <strong>{{ book.title }}</strong> par {{ book.author }}
        <span v-if="book.is_available" style="color: green;">- Disponible</span>
        <span v-else style="color: red;">- Indisponible</span>

        <!-- Bouton de suppression -->
        <button @click="deleteBook(book.id)">Supprimer</button>

        <!-- Bouton Modifier -->
        <button @click="editBook(book)">Modifier</button>
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
      newBook: {
        title: '',
        author: '',
        category: '',
        is_available: false
      },
      editingBook: null, // Pour gérer l'édition d'un livre
    };
  },
  computed: {
    categories() {
      return [...new Set(this.books.map(book => book.category))];
    }
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
      } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
      }
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
          this.selectedCategory === '' || book.category === this.selectedCategory;

        return matchesSearch && matchesAvailability && matchesCategory;
      });
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedAvailability = '';
      this.selectedCategory = '';
      this.applyFilters();
    },
    async addBook() {
      const newBookData = { ...this.newBook };
      try {
        const response = await fetch('http://localhost:3000/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBookData)
        });

        if (response.ok) {
          const newBook = await response.json();
          this.books.push(newBook);
          this.applyFilters();
          this.newBook = { title: '', author: '', category: '', is_available: false };
          alert('Livre ajouté avec succès');
        } else {
          const errorData = await response.json();
          alert(`Erreur : ${errorData.message || 'Erreur inconnue'}`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du livre', error);
        alert('Erreur réseau : Impossible de se connecter au serveur');
      }
    },
    async deleteBook(bookId) {
      if (confirm('Voulez-vous vraiment supprimer ce livre ?')) {
        try {
          const response = await fetch(`http://localhost:3000/books/${bookId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            this.books = this.books.filter(book => book.id !== bookId);
            this.applyFilters();
            alert('Livre supprimé avec succès');
          } else {
            const errorData = await response.json();
            alert(`Erreur : ${errorData.message || 'Erreur inconnue'}`);
          }
        } catch (error) {
          console.error('Erreur lors de la suppression du livre', error);
          alert('Erreur réseau : Impossible de se connecter au serveur');
        }
      }
    },
    editBook(book) {
      this.editingBook = { ...book }; // Copier les données du livre pour l'édition
    },
    async updateBook() {
      try {
        const response = await fetch(`http://localhost:3000/books/${this.editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editingBook)
        });

        if (response.ok) {
          const updatedBook = await response.json();
          const index = this.books.findIndex(book => book.id === updatedBook.id);
          this.books.splice(index, 1, updatedBook); // Mettre à jour le livre dans la liste
          this.applyFilters();
          this.editingBook = null; // Fermer le formulaire d'édition
          alert('Livre mis à jour avec succès');
        } else {
          const errorData = await response.json();
          alert(`Erreur : ${errorData.message || 'Erreur inconnue'}`);
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du livre', error);
        alert('Erreur réseau : Impossible de se connecter au serveur');
      }
    },
    cancelEdit() {
      this.editingBook = null; // Annuler l'édition
    }
  }
};
</script>

<style scoped>
/* Ajoutez ici votre style pour améliorer l'apparence du composant */
button {
  margin: 5px;
}
</style>
