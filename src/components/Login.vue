<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {handleLogin} from '@/api/auth.js'
import {useRouter} from 'vue-router'

const store = useStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const loginError = ref('')

const validate = () => {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = 'Invalid email'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  }

  return isValid
}

const login = async () => {
  if (!validate()) return

  try {
    let response = await handleLogin(email.value, password.value)
    if (response.status === 200) {
      const {jwt, totalSum, pendingDonations, completedDonations, totalMonetary, totalItems } = response.data
      store.dispatch('login', {
        token: jwt,
        totalAmount: totalSum,
        pendingDonations: pendingDonations,
        completedDonations: completedDonations,
        monetaryDonations: totalMonetary,
        itemDonations: totalItems
      })
      router.push('/')
    } else {
      loginError.value = response.data.message
    }
  } catch (error) {
    loginError.value = "Error ao fazer login. Tente novamente."
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
        <input type="email" id="email" v-model="email" :class="{ 'input-error': emailError }">
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="password" :class="{ 'input-error': passwordError }">
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
      </div>
      <span v-if="loginError" class="error-message">{{ loginError }}</span>
      <button type="submit">Login</button>
    </form>
    <p><a @click="goToRegister">Cadastrar nova Ong</a></p>
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