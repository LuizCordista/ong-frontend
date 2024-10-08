import axios from 'axios';

const API_URL = 'https://ong-backend-production.up.railway.app';

export const handleLogin = async (email, password) => {
    return await axios.post(`${API_URL}/auth/login`, {username: email, password});
};

export const handleRegister = async (ongName, email, password) => {
    try {
        return await axios.post(`${API_URL}/auth/register`, {name: ongName, email, password});
    } catch (error) {
        console.error('Erro ao registrar:', error);
        throw error;
    }
};