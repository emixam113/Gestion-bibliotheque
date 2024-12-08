<template>
    <div>
    <PieChart :data="chartData" />
    </div>
  </template>
  
  <script>
  import { ArcElement, CategoryScale, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'vue-chartjs';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
  
  export default {
    components: {
    PieChart: Pie,
    },
    data() {
      return {
        books: [],  // Liste des livres
      };
    },
    computed: {
      // On génère les données pour le graphique basé sur la disponibilité
      chartData() {
        const availableBooks = this.books.filter(book => book.is_available).length;
        const unavailableBooks = this.books.length - availableBooks;
  
        return {
          labels: ['Disponible', 'Indisponible'],
          datasets: [
            {
              data: [availableBooks, unavailableBooks],
              backgroundColor: ['#4caf50', '#f44336'],  // Vert pour disponible, Rouge pour indisponible
              hoverBackgroundColor: ['#45a049', '#e53935'],
            },
          ],
        };
      },
    },
    mounted() {
      this.fetchBooks();
    },
    methods: {
      async fetchBooks() {
        try {
          const response = await fetch('http://localhost:3000/api/books');
          const data = await response.json();
          this.books = data;  // Mettre à jour la liste des livres
        } catch (error) {
          console.error('Erreur lors de la récupération des livres', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h3 {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  