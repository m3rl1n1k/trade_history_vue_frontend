<script setup>
import {onMounted, ref, watch} from 'vue';
import axios from 'axios';
import emitter from '@/eventBus.js';
import LoaderComponent from '@/components/LoaderComponent.vue';
import AlertComponent from '@/components/AlertComponent.vue';


const isLoading = ref(false);
const wallet = ref('');
const category = ref('');
const amount = ref(0);
const created_at = ref('');
const description = ref('');
const type = ref('');
const wallets = ref([]);
const mainCategories = ref([]);

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  transaction: {
    type: Object
  },
  refreshCategories: {
    type: Function,
    default: (() => {
    })
  }
});

const emit = defineEmits(['refreshData'])
const closeModal = () => {
  getCategories()
  getWallets()
  const modal = document.getElementById('transaction'); // Змініть на ID вашого модального вікна
  const modalInstance = bootstrap.Modal.getInstance(modal);
  if (modalInstance) {
    modalInstance.hide();
  }
}

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
    const response = await axios.get('http://13.51.157.55/api/v1/wallets', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
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
    const response = await axios.get('http://13.51.157.55/api/v1/categories/main', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    mainCategories.value = response.data.main_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

async function save() {
  isLoading.value = true;

  const data = {
    amount: amount.value,
    created_at: created_at.value,
    description: description.value,
    flag: !props.isEdit ? "new" : "edit",
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
    let response;
    if (!props.isEdit) {
      response = await axios.post("http://13.51.157.55/api/v1/transactions/new", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (response.status === 201) {
        emitter.emit('alertSuccess', response.data.message);
      }
    } else {
      response = await axios.put(`http://13.51.157.55/api/v1/transactions/edit/${props.transaction.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        emitter.emit('alertSuccess', response.data.message);
      }
    }
    closeModal()
  } catch (err) {
    console.error(err);
    emitter.emit('alertError', 'An error occurred while saving the data.');
  } finally {
    setMaxDate()
    amount.value = 0
    category.value = ""
    description.value = ""
    type.value = ""
    wallet.value = ""
    isLoading.value = false;
    emit('refreshData');
  }
}

onMounted(() => {
  setMaxDate();
  getWallets();
  getCategories();
});

watch(() => props.transaction, (newVal) => {
  if (props.isEdit && props.transaction) {
    amount.value = newVal.amount
    category.value = newVal.category ? newVal.category.url : null
    created_at.value = newVal.created_at.split(' ')[0]
    description.value = newVal.description
    type.value = newVal.type
    wallet.value = newVal.wallet.url
  } else {
    setMaxDate()
    amount.value = 0
    category.value = ""
    description.value = ""
    type.value = ""
    wallet.value = ""
  }
})
</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <alert-component></alert-component>
  <form @submit.prevent="save">
    <div class="modal-dialog modal-fullscreen">
      <div id="transaction" aria-hidden="true" aria-labelledby="staticBackdropLabel" class="modal fade"
           data-bs-backdrop="static"
           data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 id="staticBackdropLabel" class="modal-title fs-5">{{ props.isEdit ? 'Edit' : 'New' }} Transaction
              </h1>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
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
                  <router-link to="/wallets/new" @click="closeModal">Create</router-link>
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
              <div v-if="mainCategories.length > 0" class="form-floating mb-3">
                <select id="category" v-model="category" class="form-select" name="category">
                  <optgroup v-for="mainCategory in mainCategories" :key="mainCategory.url"
                            :label=" mainCategory.name">
                    <option v-for="subCategory in  mainCategory.categories" v-if="mainCategory.categories.length >0"
                            :value="subCategory.url">
                      - {{ subCategory.name }}
                    </option>
                  </optgroup>
                </select>
                <label for="category">Category</label>
              </div>
              <div v-else class="form-floating mb-3">
                <div class="form-select">
                  You don't have any category.
                  <router-link to="/categories/new" @click="closeModal">Create</router-link>
                </div>
              </div>
              <!-- Type dropdown -->
              <div class="form-floating mb-3">
                <select id="type" v-model="type" class="form-select" name="type" required>
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
                  <textarea id="description" v-model="description" class="form-control"
                            placeholder="Description"></textarea>
                <label for="description">Description</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
              <button v-if="props.isEdit" class="btn btn-danger" type="button" @click="deleteSubCategory">Delete
              </button>
              <button class="btn btn-success" type="submit">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
textarea {
  min-height: 100px !important;
}
</style>