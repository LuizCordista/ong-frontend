import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const handleLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { username: email, password });
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

export const handleRegister = async (ongName, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { name: ongName, email, password });
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar:', error);
        throw error;
    }
};