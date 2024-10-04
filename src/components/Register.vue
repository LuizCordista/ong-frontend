<script setup>
import {ref, watch} from 'vue'
import { handleRegister } from '@/api/auth.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const nameError = ref(null)
const emailError = ref(null)
const passwordError = ref(null)
const registerError = ref(null)

const validate = () => {
  let isValid = true
  nameError.value = null
  emailError.value = null
  passwordError.value = null

  if (!name.value) {
    nameError.value = 'Nome é obrigatório'
    isValid = false
  }

  if (!email.value) {
    emailError.value = 'Email é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = 'Email inválido'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Senha é obrigatória'
    isValid = false
  }

  return isValid
}


const register = async () => {
  if (!validate()) return

  try {
    let response = await handleRegister(name.value, email.value, password.value)
    if (response.status === 200) {
      router.push('/login')
    } else {
      registerError.value = response.data.message
    }
  } catch (error) {
    registerError.value = "Erro ao registrar. Tente novamente."
    console.error('Error:', error)
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div id="container">
    <h2>Registrar</h2>
    <form @submit.prevent="register">
      <div>
        <label for="name">Nome da Ong:</label>
        <input type="text" id="name" v-model="name" :class="{ 'input-error': nameError }">
        <span v-if="nameError" class="error-message">{{ nameError }}</span>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" :class="{ 'input-error': emailError }">
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="password" :class="{ 'input-error': passwordError }">
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
      </div>
      <span v-if="registerError" class="error-message">{{ registerError }}</span>
      <button type="submit">Registrar</button>
    </form>
    <p><a @click="goToLogin">Entrar</a></p>
  </div>
</template>


<style scoped>
#container {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

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

.error-message {
  color: red;
  font-size: 14px;
  position: relative;
  top: -12px;
  margin-bottom: 10px;
}

.input-error {
  border: 2px solid red !important;
}
</style>