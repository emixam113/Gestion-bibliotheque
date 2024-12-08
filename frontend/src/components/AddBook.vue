<template>
  <div>
    <h2>Ajouter un livre dans la bibliothèque</h2>
    <form @submit.prevent="addBook">
      <label for="title">Titre</label>
      <input id="title" v-model="title" type="text" placeholder="Titre" required />

      <label for="author">Auteur</label>
      <input id="author" v-model="author" type="text" placeholder="Auteur" required />

      <label for="publish_date">Date de publication</label>
      <input id="publish_date" v-model="publish_date" type="date" required />

      <label for="is_available">Disponibilité</label>
      <select v-model="is_available">
        <option :value="true">Disponible</option>
        <option :value="false">Indisponible</option>
      </select>

      <label for="category">Catégorie</label>
      <input id="category" v-model="category" type="text" placeholder="Catégorie" required />

      <button type="submit">Ajouter dans la bibliothèque</button>
      <button type="button" @click="resetForm">Annuler</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      author: '',
      publish_date: '',
      is_available: true,
      category: '' // Ajout du modèle category
    };
  },
  methods: {
    async addBook() {
      try {
        const response = await fetch('http://localhost:3000/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: this.title,
            author: this.author,
            publish_date: this.publish_date,
            is_available: this.is_available,
            category: this.category // Ajout de category dans le corps de la requête
          })
        });

        if (response.ok) {
          alert('Livre ajouté avec succès');
          this.resetForm();
        } else {
          const errorData = await response.json();
          alert(`Erreur : ${errorData.message || "Erreur inconnue"}`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du livre', error);
        alert('Erreur réseau : Impossible de se connecter au serveur');
      }
    },
    resetForm() {
      this.title = '';
      this.author = '';
      this.publish_date = '';
      this.is_available = true;
      this.category = ''; // Réinitialisation de category
    }
  }
};
</script>
