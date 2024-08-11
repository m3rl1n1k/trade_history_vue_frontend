<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import emitter from '@/eventBus.js';
import LoaderComponent from '@/components/LoaderComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import SidebarComponent from '@/components/SidebarComponent.vue';
import AlertComponent from '@/components/AlertComponent.vue';
import router from "@/router/index.js";

const isLoading = ref(false);
const wallet = ref('');
const category = ref('');
const amount = ref(0);
const created_at = ref('');
const description = ref('');
const type = ref('');
const wallets = ref([]);
const categories = ref([]);

function setMaxDate() {
  const datepicker = document.querySelector('#datepicker');
  const max = new Date().toISOString().split('T')[0];
  datepicker.setAttribute('max', max);
  datepicker.value = max;
  created_at.value = max;
}

async function getWallets() {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:2280/api/v1/wallets', {
      headers: {
        'Accept' : 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      },
    });
    wallets.value = response.data.wallets;
  } catch (error) {
    console.error('Error fetching wallets:', error);
  } finally {
    isLoading.value = false;
  }
}

async function getCategories() {
  try {
    const response = await axios.get('http://localhost:2280/api/v1/categories', {
      headers: {
        'Accept' : 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      },
    });
    categories.value = response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

function errorHandler(err) {
  const {status} = err.response;

  if (status === 400) {
    emitter.emit('alertDanger', err.response.data.message);
  } else if (status === 404) {
    emitter.emit('alertDanger', [
      err.response.data.message,
      err.response.data.item
    ]);
  } else {
    emitter.emit('alertDanger', 'Error on server');
  }
}

async function createTransaction() {
  isLoading.value = true;

  const data = {
    amount: amount.value,
    created_at: created_at.value,
    description: description.value,
    flag: 'new',
    type: type.value,
    wallet: {
      url: wallet.value,
    },
    category: {
      url: category.value,
    },
  };

  try {
    if (!wallet.value
        || !amount.value
        || !type.value) {
      emitter.emit("showAlert", "You have mistakes in form.")
      return;
    }
    const response = await axios.post('http://localhost:2280/api/v1/transactions/new', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      },
    });
    emitter.emit('alertSuccess', response.data.message);
    await router.push('/transactions');
  } catch (err) {
    errorHandler(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  setMaxDate();
  getWallets();
  getCategories();
});
</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <header-component></header-component>
  <sidebar-component></sidebar-component>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Transactions</h1>
    </div>
    <alert-component></alert-component>
    <form @submit.prevent="createTransaction">
      <!-- Wallet dropdown -->
      <div v-if="wallets.length > 0" class="form-floating mb-3">
        <select id="wallet" v-model="wallet" class="form-select" name="wallet" required>
          <option selected>Choose...</option>
          <option v-for="wallet in wallets" :key="wallet.url" :value="wallet.url">
            {{ wallet.currency }} | {{ wallet.number }} | {{ wallet.amount }}
          </option>
        </select>
        <label for="wallet">From/to</label>
      </div>
      <div v-else class="form-floating mb-3">
        <div class="form-select">
          You don't have any wallet.
          <router-link to="/wallets/new">Create</router-link>
        </div>
      </div>
      <!-- Amount -->
      <div class="form-floating mb-3">
        <input id="amount"
               v-model.number="amount"
               class="form-control"
               min="0"
               placeholder="Amount"
               required
               step="0.01"
               type="number"
        />
        <label for="amount">Amount</label>
      </div>
      <!-- Category dropdown -->
      <div v-if="categories.length > 0" class="form-floating mb-3">
        <select id="category" v-model="category" class="form-select" name="category">
          <option selected>Choose...</option>
          <option v-for="category in categories" :key="category.url" :value="category.url">
            {{ category.name }}
          </option>
        </select>
        <label for="category">Category</label>
      </div>
      <div v-else class="form-floating mb-3">
        <div class="form-select">
          You don't have any category.
          <router-link to="/category/new">Create</router-link>
        </div>
      </div>
      <!-- Type dropdown -->
      <div class="form-floating mb-3">
        <select id="type" v-model="type" class="form-select" name="type" required>
          <option selected>Choose...</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <label for="type">Type</label>
      </div>
      <!-- Date -->
      <div class="form-floating mb-3">
        <input
            id="datepicker"
            v-model="created_at"
            class="form-control"
            max=""
            placeholder="Date"
            type="date"
        />
        <label for="datepicker">Date</label>
      </div>
      <!-- Description -->
      <div class="form-floating mb-3">
        <textarea id="description" v-model="description" class="form-control" placeholder="Description"></textarea>
        <label for="description">Description</label>
      </div>
      <div class="row g-3">
        <button class="btn btn-success" type="submit">Create</button>
        <router-link class="btn btn-outline-secondary" to="/transactions">Go back</router-link>
      </div>
    </form>
  </main>
</template>

<style scoped>
textarea {
  min-height: 100px !important;
}
</style>