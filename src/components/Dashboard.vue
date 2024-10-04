<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  createDonation,
  fetchDonationsData,
  fetchAllDonations,
  updateDonation,
  deleteDonation,
  updateDonationStatus,
  generateReports
} from '@/api/donations';
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const store = useStore();
const router = useRouter();

const totalAmount = ref(0);
const pendingDonations = ref(0);
const completedDonations = ref(0);
const monetaryDonations = ref(0);
const itemDonations = ref(0);
const donations = ref([]);
const showDonationsList = ref(false);

const refreshDonations = async () => {
  try {
    const data = await fetchDonationsData();
    store.dispatch('setDonationsCount', {
      totalAmount: data.totalSum,
      pendingDonations: data.pendingDonations,
      completedDonations: data.completedDonations,
      monetaryDonations: data.totalMonetary,
      itemDonations: data.totalItems
    });
    totalAmount.value = data.totalSum;
    pendingDonations.value = data.pendingDonations;
    completedDonations.value = data.completedDonations;
    monetaryDonations.value = data.totalMonetary;
    itemDonations.value = data.totalItems;
  } catch (error) {
    console.error('Error fetching donations data:', error);
  }
};

const loadAllDonations = async () => {
  try {
    donations.value = await fetchAllDonations();
  } catch (error) {
    console.error('Error fetching all donations:', error);
  }
};

let chartInstance = null;

const createChart = () => {
  const ctx = document.getElementById('donationsChart').getContext('2d');
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
  });
};

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = [monetaryDonations.value, itemDonations.value];
    chartInstance.update();
  }
};

onMounted(async () => {
  if (!store.state.isAuthenticated) {
    router.push('/login');
  }

  await refreshDonations();
  await loadAllDonations();
  createChart();
});

watch([monetaryDonations, itemDonations], updateChart);

const showModal = ref(false);
const donationType = ref('MONETARY');
const donorName = ref('');
const amount = ref(0);
const itemDescription = ref('');
const selectedDonation = ref(null);

const handleCreateDonation = async () => {
  const donationData = {
    donorName: donorName.value,
    donationType: donationType.value,
    amount: donationType.value === 'MONETARY' ? amount.value : 0,
    itemDescription: donationType.value === 'ITEM' ? itemDescription.value : '',
    status: 'PENDING'
  };

  try {
    await createDonation(donationData);
    refreshDonations();
    loadAllDonations();
    showModal.value = false;
  } catch (error) {
    console.error('Error creating donation:', error);
  }
};

const handleEditDonation = async () => {
  if (!selectedDonation.value) return;

  const donationData = {
    donorName: donorName.value,
    donationType: donationType.value,
    amount: donationType.value === 'MONETARY' ? amount.value : 0,
    itemDescription: donationType.value === 'ITEM' ? itemDescription.value : '',
    status: 'PENDING'
  };

  try {
    await updateDonation(selectedDonation.value.id, donationData);
    refreshDonations();
    loadAllDonations();
    showModal.value = false;
  } catch (error) {
    console.error('Error updating donation:', error);
  }
};

const handleDeleteDonation = async (id) => {
  try {
    await deleteDonation(id);
    refreshDonations();
    loadAllDonations();
  } catch (error) {
    console.error('Error deleting donation:', error);
  }
};

const openEditModal = (donation) => {
  selectedDonation.value = donation;
  donorName.value = donation.donorName;
  donationType.value = donation.donationType;
  amount.value = donation.amount;
  itemDescription.value = donation.itemDescription;
  showModal.value = true;
};

const handleChangeStatus = async (id, status) => {
  try {
    await updateDonationStatus(id, status);
    refreshDonations();
    loadAllDonations();
  } catch (error) {
    console.error('Error updating donation status:', error);
  }
};

const toggleDonationsList = () => {
  showDonationsList.value = !showDonationsList.value;
};
</script>

<template>
  <div id="dashboard">
    <h2>Painel de Controle</h2>
    <div class="overview">
      <div class="card">
        <h3>Doações</h3>
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
      <button @click="showModal = true">Criar Nova Doação</button>
      <button @click="toggleDonationsList">Ver Doações Recentes</button>
      <button @click="generateReports">Gerar Relatórios</button>
      <button @click="refreshDonations">Atualizar Dados</button>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ selectedDonation ? 'Editar Doação' : 'Criar Nova Doação' }}</h3>
        <label>
          Nome do Doador:
          <input v-model="donorName" type="text" />
        </label>
        <label>
          Tipo de Doação:
          <select v-model="donationType">
            <option value="MONETARY">Monetário</option>
            <option value="ITEM">Item</option>
          </select>
        </label>
        <label v-if="donationType === 'MONETARY'">
          Quantia:
          <input v-model="amount" type="text" name="amount" />
        </label>
        <label v-if="donationType === 'ITEM'">
          Descrição do Item:
          <input v-model="itemDescription" type="text" />
        </label>
        <button @click="selectedDonation ? handleEditDonation() : handleCreateDonation()">
          {{ selectedDonation ? 'Salvar Alterações' : 'Cadastrar Nova Doação' }}
        </button>
        <button @click="showModal = false">Cancelar</button>
      </div>
    </div>

    <div v-if="showDonationsList" class="donations-list">
      <h3>Lista de Doações</h3>
      <ul>
        <li v-for="donation in donations" :key="donation.id">
          <p>
            <strong>{{ donation.donorName }}</strong> -
            <span :class="donation.donationType === 'MONETARY' ? 'monetary' : 'item'">
            {{ donation.donationType === 'MONETARY' ? donation.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : donation.description }}
          </span> -
            <span :class="donation.status === 'PENDING' ? 'pending' : 'completed'">{{ donation.status }}</span>
          </p>
          <div class="list-buttons">
            <button @click="openEditModal(donation)">Editar</button>
            <button @click="handleDeleteDonation(donation.id)">Excluir</button>
            <button @click="handleChangeStatus(donation.id, donation.status === 'PENDING' ? 'COMPLETED' : 'PENDING')">
              {{ donation.status === 'PENDING' ? 'Marcar como Completa' : 'Marcar como Pendente' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 200px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.5);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-content button {
  padding: 10px 20px;
  margin: 5px;
}

.donations-list {
  margin-top: 30px;
}

.donations-list ul {
  list-style: none;
  padding: 0;
}

.donations-list li {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.donations-list li p {
  margin: 0;
  font-size: 18px;
}

.donations-list li .monetary {
  color: #007bff;
  font-weight: bold;
}

.donations-list li .item {
  color: #000;
  font-weight: bold;
}

.donations-list li .pending {
  color: #e67e22;
  font-weight: bold;
}

.donations-list li .completed {
  color: #2ecc71;
  font-weight: bold;
}

.donations-list li button {
  margin-left: 10px;
}

.list-buttons {
  display: flex;
}
</style>