<script setup>

import LoaderComponent from "@/components/LoaderComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {onMounted, ref} from "vue";
import axios from "axios";

const wallets = ref([]);
const isLoading = ref(false);


async function getWallets() {
  isLoading.value = true;
  try {
    const response = await axios.get("https://51.20.114.2/api/v1/wallets", {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    const data = response.data;
    wallets.value = data.wallets;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}


onMounted(() => {
  getWallets();
});
</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <header-component></header-component>
  <sidebar-component></sidebar-component>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Wallets</h1>
      <router-link class="btn btn-outline-success" to="/wallets/new">Add</router-link>
    </div>
    <div v-if="wallets.length > 0" class="">
      <table class="table table-striped table-hover text-center">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Card name</th>
          <th scope="col">Card number</th>
          <th scope="col">Card Amount</th>
          <th scope="col">Card Currency</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="wallet in wallets">
          <th scope="row">{{ wallet.id }}</th>
          <td>{{ wallet.card_name.length !== 0 ? wallet.card_name : "-" }}</td>
          <td>{{ wallet.number }}</td>
          <td>{{ wallet.amount }}</td>
          <td>{{ wallet.currency }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      Not have records:
      <router-link to="wallet/new">Add one</router-link>
    </div>
  </main>

</template>

<style scoped>

</style>