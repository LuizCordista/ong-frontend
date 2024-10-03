import { createStore } from 'vuex'

const store = createStore({
  state: {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    token: localStorage.getItem('token'),
    totalAmount: parseFloat(localStorage.getItem('totalAmount')) || 0,
    pendingDonations: parseInt(localStorage.getItem('pendingDonations')) || 0,
    completedDonations: parseInt(localStorage.getItem('completedDonations')) || 0,
    monetaryDonations: parseFloat(localStorage.getItem('monetaryDonations')) || 0,
    itemDonations: parseInt(localStorage.getItem('itemDonations')) || 0
  },
  mutations: {
    setAuth(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.token = payload.token;
      state.totalAmount = payload.totalAmount;
      state.pendingDonations = payload.pendingDonations;
      state.completedDonations = payload.completedDonations;
      state.monetaryDonations = payload.monetaryDonations;
      state.itemDonations = payload.itemDonations;

      localStorage.setItem('isAuthenticated', payload.isAuthenticated);
      localStorage.setItem('token', payload.token);
      localStorage.setItem('totalAmount', payload.totalAmount);
      localStorage.setItem('pendingDonations', payload.pendingDonations);
      localStorage.setItem('completedDonations', payload.completedDonations);
      localStorage.setItem('monetaryDonations', payload.monetaryDonations);
      localStorage.setItem('itemDonations', payload.itemDonations);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('totalAmount');
      localStorage.removeItem('pendingDonations');
      localStorage.removeItem('completedDonations');
      localStorage.removeItem('monetaryDonations');
      localStorage.removeItem('itemDonations');
    },
    setDonationsCount(state, payload) {
      state.totalAmount = payload.totalAmount;
      state.pendingDonations = payload.pendingDonations;
      state.completedDonations = payload.completedDonations;
      state.monetaryDonations = payload.monetaryDonations;
      state.itemDonations = payload.itemDonations;

      localStorage.setItem('totalAmount', payload.totalAmount);
      localStorage.setItem('pendingDonations', payload.pendingDonations);
      localStorage.setItem('completedDonations', payload.completedDonations);
      localStorage.setItem('monetaryDonations', payload.monetaryDonations);
      localStorage.setItem('itemDonations', payload.itemDonations);
    }
  },

  actions: {
    login({ commit }, { token, totalAmount, pendingDonations, completedDonations, monetaryDonations, itemDonations }) {
      commit('setAuth', { isAuthenticated: true, token, totalAmount, pendingDonations, completedDonations, monetaryDonations, itemDonations })
    },
    logout({ commit }) {
      commit('logout')
    },
    setDonationsCount({ commit }, { totalAmount, pendingDonations, completedDonations, monetaryDonations, itemDonations }) {
      commit('setDonationsCount', { totalAmount, pendingDonations, completedDonations, monetaryDonations, itemDonations })
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    token: state => state.token,
    donationsCount: state => state.donationsCount,
    totalAmount: state => state.totalAmount,
    pendingDonations: state => state.pendingDonations,
    completedDonations: state => state.completedDonations,
    monetaryDonations: state => state.monetaryDonations,
    itemDonations: state => state.itemDonations
  }
})

export default store