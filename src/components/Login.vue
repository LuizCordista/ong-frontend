<script setup>
import { ref } from 'vue'
import { handleLogin } from '@/api/auth.js'
import {useRouter} from "vue-router";

const router = useRouter()

const email = ref('')
const password = ref('')

const login = async () => {
  console.log('Email:', email.value)
  console.log('Password:', password.value)

  try {
    let response = await handleLogin(email.value, password.value)
    console.log('Response:', response)
  } catch (error) {
    console.error('Error:', error)
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div id="container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Entrar</button>
    </form>
    <p><a @click="goToRegister">Criar conta</a></p>
  </div>
</template>

<style scoped>
#container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  font-family: 'Arial', sans-serif;
}

/* Estilo do título */
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

/* Estilo dos labels */
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

/* Estilo dos inputs */
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
}

/* Estilo do botão */
button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* Estilo do link */
a {
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>