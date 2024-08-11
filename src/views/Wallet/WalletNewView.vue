<script setup>
import LoaderComponent from "@/components/LoaderComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import emitter from "@/eventBus.js";
import AlertComponent from "@/components/AlertComponent.vue";
import router from "@/router/index.js";

const isLoading = ref(false);
const wallet_name = ref("");
const currency = ref("");
const amount = ref(0.0);
const curr_list = ref([]);

// create wallet
const createWallet = async () => {
  isLoading.value = true;

  const data = {
    card_name: wallet_name.value,
    amount: amount.value,
    flag: "new",
    currency: currency.value,
  };

  try {
    const response = await axios.post(
        "http://localhost:2280/api/v1/wallets/new",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
          },
        }
    );
    emitter.emit('alertSuccess', response.data.message);
    await router.push('/wallets');
  } catch (err) {
    errorHandler(err);
  } finally {
    isLoading.value = false;
  }
};

// get currencies
const currencies = async () => {
  isLoading.value = true;

  try {
    const response = await axios.get(
        "http://localhost:2280/api/v1/currency",
        {
          headers: {
            'Accept' : "application/json",
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
          },
        }
    );
    curr_list.value = response.data.currencies;
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
};

// error handler
const errorHandler = (err) => {
  const { status } = err.response;
  if (status === 201) {
    emitter.emit('alertSuccess', err.response.data.message);
  } else if (status === 400) {
    emitter.emit('alertDanger', err.response.data.message);
  } else if (status === 404) {
    emitter.emit('alertDanger', "Not found");
  } else {
    emitter.emit('alertDanger', "Error on server");
  }
  console.log(err);
};

onMounted(() => {
  currencies();
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
    <form @submit.prevent="createWallet">
      <!--    amount-->
      <div class="form-floating mb-3">
        <input
            id="wallet_name"
            v-model="wallet_name"
            class="form-control"
            min="0"
            placeholder="Wallet name"
            type="text"
        />
        <label for="wallet_name">Wallet name</label>
      </div>
      <!--    amount-->
      <div class="form-floating mb-3">
        <input
            id="amount"
            v-model="amount"
            class="form-control"
            min="0"
            placeholder="Amount"
            step="0.01"
            type="number"
        />
        <label for="amount">Amount</label>
      </div>
      <div class="form-floating mb-3">
        <select required id="currency" v-model="currency" class="form-select" name="currency">
          <option v-for="currency in curr_list" :value="currency.name">{{ currency.name }}</option>
        </select>
        <label for="currency">Currency</label>
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