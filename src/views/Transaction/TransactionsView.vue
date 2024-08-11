<script>
import {ref, reactive, onMounted} from 'vue';
import axios from 'axios';
import LoaderComponent from "@/components/LoaderComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";

export default {
  components: {
    LoaderComponent,
    HeaderComponent,
    SidebarComponent
  },
  setup() {
    const transactions_list = ref([]);
    const categoryCache = reactive({});
    const walletCache = reactive({});
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

    async function getCategoryName(categoryUrl) {

      if (categoryCache[categoryUrl]) {
        return categoryCache[categoryUrl].name;
      }

      try {
        const response = await axios.get(`http://localhost:2280${categoryUrl}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const category = response.data;
        categoryCache[categoryUrl] = category;
        return category.name;
      } catch (error) {
        console.error(error);
        return 'Unknown';
      }
    }

    async function getWallet(walletUrl) {
      if (walletCache[walletUrl]) {
        return walletCache[walletUrl].name ?? walletCache[walletUrl].number;
      }

      try {
        const response = await axios.get(`http://localhost:2280${walletUrl}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const wallet = response.data;
        walletCache[walletUrl] = wallet;
        return wallet.name ?? wallet.number;
      } catch (error) {
        console.error(error);
        return 'Unknown';
      }
    }

    async function getTransactionsList(page = 1) {
      isLoading.value = true;
      try {
        const response = await axios.get(`http://localhost:2280/api/v1/transactions?page=${page}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data;
        transactions_list.value = await Promise.all(data.transactions.items.map(async transaction => {
          if (transaction.wallet && transaction.wallet.url) {
            transaction.wallet = await getWallet(transaction.wallet.url);
          }
          if (transaction.category && transaction.category.url) {
            transaction.category_name = await getCategoryName(transaction.category.url);
            transaction.wallet = await getWallet(transaction.wallet.url);
          } else {
            transaction.category_name = 'Unknown';
          }
          return transaction;
        }));

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

    return {
      transactions_list,
      isLoading,
      pagination,
      changePage
    };
  }
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
      <router-link class="btn btn-outline-success" to="/transactions/new">Add</router-link>
    </div>
    <div v-if="transactions_list.length > 0" class="">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Amount</th>
          <th scope="col">Category</th>
          <th scope="col">Wallet</th>
          <th scope="col">Type</th>
          <th scope="col">Created At</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="transaction in transactions_list">
          <th scope="row">{{ transaction.id }}</th>
          <td> {{ transaction.amount }}</td>
          <td>{{ transaction.category_name ?? "Unknown" }}</td>
          <td>{{ transaction.wallet }}</td>
          <td>{{ transaction.type }}</td>
          <td>{{ transaction.created_at }}</td>
        </tr>
        </tbody>
      </table>
      <!--      <div  :key="transaction.id">-->
      <!--      </div>-->
      <div>
        <button :disabled="!pagination.has_previous_page" @click="changePage(pagination.current_page - 1)">Previous
        </button>
        <button v-for="page in pagination.pages" :key="page" @click="changePage(page)">{{ page }}</button>
        <button :disabled="!pagination.has_next_page" @click="changePage(pagination.current_page + 1)">Next</button>
      </div>
    </div>
    <div v-else>
      Not have records:
      <router-link to="transactions/new">Add one</router-link>
    </div>
  </main>
</template>

<style scoped>

</style>
