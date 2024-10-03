<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { fetchDonationsData } from '@/api/donations'
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale)

const store = useStore()
const router = useRouter()

const totalAmount = ref(0)
const pendingDonations = ref(0)
const completedDonations = ref(0)
const monetaryDonations = ref(0)
const itemDonations = ref(0)

const refreshDonations = async () => {
  try {
    const data = await fetchDonationsData()
    store.dispatch('setDonationsCount', {
      totalAmount: data.totalSum,
      pendingDonations: data.pendingDonations,
      completedDonations: data.completedDonations,
      monetaryDonations: data.totalMonetary,
      itemDonations: data.totalItems
    })
    totalAmount.value = data.totalSum
    pendingDonations.value = data.pendingDonations
    completedDonations.value = data.completedDonations
    monetaryDonations.value = data.totalMonetary
    itemDonations.value = data.totalItems
  } catch (error) {
    console.error('Error fetching donations data:', error)
  }
}

let chartInstance = null

const createChart = () => {
  const ctx = document.getElementById('donationsChart').getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Monetário', 'Itens'],
      datasets: [{
        label: 'Doações',
        data: [monetaryDonations.value, itemDonations.value],
        backgroundColor: ['#007bff', '#28a745']
      }]
    }
  })
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = [monetaryDonations.value, itemDonations.value]
    chartInstance.update()
  }
}

onMounted(async () => {
  if (!store.state.isAuthenticated) {
    router.push('/login')
  }

  await refreshDonations()
  createChart()
})

watch([monetaryDonations, itemDonations], updateChart)
</script>

<template>
  <div id="dashboard">
    <h2>Painel de Controle</h2>
    <div class="overview">
      <div class="card">
        <h3>Doações Este Mês</h3>
        <canvas id="donationsChart"></canvas>
      </div>
      <div class="card">
        <h3>Total Arrecadado</h3>
        <p>{{ totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</p>
      </div>
      <div class="card">
        <h3>Doações Pendentes</h3>
        <p>{{ pendingDonations }}</p>
      </div>
      <div class="card">
        <h3>Doações Completas</h3>
        <p>{{ completedDonations }}</p>
      </div>
    </div>
    <div class="shortcuts">
      <button @click="createDonation">Criar Nova Doação</button>
      <button @click="viewRecentDonations">Ver Doações Recentes</button>
      <button @click="generateReports">Gerar Relatórios</button>
      <button @click="refreshDonations">Atualizar Dados</button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos existentes */
#dashboard {
  width: 80%;
  margin: 0 auto;
  padding: 40px;
  background-color: #f4f7fb;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
}

.overview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.card {
  flex: 1;
  min-width: 280px;
  padding: 30px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.card h3 {
  font-size: 22px;
  color: #34495e;
  margin-bottom: 15px;
}

.card p {
  font-size: 20px;
  color: #2980b9;
  font-weight: bold;
}

.shortcuts {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

button {
  padding: 15px 25px;
  background-color: #3498db;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  flex: 1;
  margin: 0 10px;
}

button:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.5);
}
</style>