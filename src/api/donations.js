import store from '@/auth/index.js'

export async function fetchDonationsData() {
  const token = store.state.token;
  const response = await fetch('http://localhost:8080/donation/total', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar dados das doações');
  }
  return response.json();
}