import axios from 'axios';
import store from '@/auth/index.js';

export async function fetchDonationsData() {
  const token = store.state.token;
  const response = await fetch('https://ong-backend-production.up.railway.app/donation/total', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar dados das doações');
  }
  return response.json();
}

export const createDonation = async (donationData) => {
  try {
    const response = await axios.post('https://ong-backend-production.up.railway.app/donation/create', donationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

export const fetchAllDonations = async () => {
  try {
    const response = await axios.get('https://ong-backend-production.up.railway.app/donation/all', {
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all donations:', error);
    throw error;
  }
};

export const updateDonationStatus = async (id, status) => {
  try {
    const response = await axios.put(`https://ong-backend-production.up.railway.app/donation/${id}/status`, null, {
      params: { status },
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
};

export const updateDonation = async (id, donationData) => {
  try {
    const response = await axios.put(`https://ong-backend-production.up.railway.app/donation/${id}`, donationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating donation:', error);
    throw error;
  }
};

export const deleteDonation = async (id) => {
  try {
    const response = await axios.delete(`https://ong-backend-production.up.railway.app/donation/${id}`, {
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting donation:', error);
    throw error;
  }
};

export const generateReports = async () => {
  try {
    const response = await fetch('https://ong-backend-production.up.railway.app/donation/export/excel', {
      method: 'GET',
        headers: {
            'Authorization': `Bearer ${store.state.token}`
        }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations_report.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};