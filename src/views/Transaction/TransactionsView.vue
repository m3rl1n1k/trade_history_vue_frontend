<script setup>
import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';
import LoaderComponent from "@/components/LoaderComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import TransactionFormComponent from "@/components/forms/TransactionFormComponent.vue";

let transactions_list = ref([]);
const isLoading = ref(false);
const pagination = reactive({
  current_page: 1,
  has_next_page: true,
  has_previous_page: false,
  per_page: 10,
  total_items: 22,
  total_pages: 3,
  pages: []
});
const isEditTransaction = ref(false)
const selectedTransaction = ref(null)

async function getTransactionsList(page = 1) {
  isLoading.value = true;
  try {
    const response = await axios.get(`https://51.20.114.2/api/v1/transactions?page=${page}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    const data = response.data;
    transactions_list = data.transactions.items

    pagination.current_page = page;
    pagination.has_next_page = data.transactions.pagination.has_next_page;
    pagination.has_previous_page = data.transactions.pagination.has_previous_page;
    pagination.total_pages = data.transactions.pagination.total_pages;
    pagination.pages = Array.from({length: pagination.total_pages}, (v, k) => k + 1);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

function changePage(page) {
  if (page < 1 || page > pagination.total_pages) return;
  getTransactionsList(page);
}

onMounted(() => {
  getTransactionsList();
});
const openModal = (modal_id) => {
  const modal = new bootstrap.Modal(document.getElementById(modal_id));
  modal.show();
}

const openEditTransactionModal = (transaction) => {
  selectedTransaction.value = transaction
  isEditTransaction.value = true
  openModal('transaction')
};
</script>
<template>
  <loader-component :visible="isLoading"></loader-component>
  <header-component></header-component>
  <sidebar-component></sidebar-component>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Transactions</h1>
      <a class="btn btn-outline-success"
         @click="selectedTransaction=null, isEditTransaction= false, openModal('transaction')">Add</a>
    </div>
    <div v-if="transactions_list.length > 0" class="">
      <div class="row">
        <div class="table-responsive">
          <table class="table table-hover text-center">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Wallet</th>
              <th>Type</th>
              <th>Created At</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="transaction in transactions_list" class="cursor-pointer"
                @click="openEditTransactionModal(transaction)">
              <th scope="row">{{ transaction.id }}</th>
              <td> {{ transaction.amount }}</td>
              <td>{{ transaction.category ? transaction.category.name : "-" }}</td>
              <td>
                {{
                  transaction.wallet.card_name.length !== 0 ? transaction.wallet.card_name : transaction.wallet.number
                }}
              </td>
              <td>{{ transaction.type }}</td>
              <td>{{ transaction.created_at.split(" ")[0] }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div aria-label="Basic example" class="btn-group" role="group">
        <button :disabled="!pagination.has_previous_page" class="btn btn-info text-black"
                @click="changePage(pagination.current_page - 1)">Previous
        </button>
        <button v-for="page in pagination.pages" :key="page" class="btn btn-info"
                @click="changePage(page)">{{ page }}
        </button>
        <button :disabled="!pagination.has_next_page" class="btn btn-info text-black"
                @click="changePage(pagination.current_page + 1)">Next
        </button>
      </div>
    </div>
    <div v-else>
      Not have records:
      <a class="text-primary cursor-pointer" @click="openModal('transaction')">Add one</a>
    </div>

    <transaction-form-component
        :is-edit="isEditTransaction"
        :transaction="selectedTransaction"
        @refreshData="getTransactionsList"
    ></transaction-form-component>
  </main>
</template>

<style scoped>
</style>
