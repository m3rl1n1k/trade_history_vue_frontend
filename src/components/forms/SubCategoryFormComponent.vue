<script setup>
import {onMounted, ref, watch} from 'vue';
import LoaderComponent from '@/components/LoaderComponent.vue';
import AlertComponent from '@/components/AlertComponent.vue';
import axios from "axios";
import emitter from "@/eventBus.js";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  subCategory: {
    type: Object,
  },
  mainCategory: {
    type: Object
  },
  refreshCategories: {
    type: Function,
    default: (() => {
    })
  }
});

const isLoading = ref(false);
const sub_category_name = ref('');
const main_categories = ref([]);
const main_category = ref({});
const sub_category_name_Error = ref('');
const main_category_name_Error = ref('');
const sub_category_color = ref('#d4f7f3');

const emit = defineEmits(['refreshData'])

const getMainCategories = async () => {
  try {
    isLoading.value = true
    axios.get("http://localhost:2280/api/v1/categories/main", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    }).then(response => {
      main_categories.value = response.data.main_categories
    })
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  const modal = document.getElementById('sub_category'); // Змініть на ID вашого модального вікна
  const modalInstance = bootstrap.Modal.getInstance(modal);
  if (modalInstance) {
    modalInstance.hide();
  }
}

const validateMainCategory = () => {
  let bool = main_category.value.length > 0
  if (!bool)
    main_category_name_Error.value = "Main category name can't be empty"
  else
    main_category_name_Error.value = ''
}
const validateSubCategory = () => {
  if (!sub_category_name.value)
    sub_category_name_Error.value = "Sub-category name can't be empty"
  else
    sub_category_name_Error.value = ''
}

const save = async () => {
  validateMainCategory()
  validateSubCategory()

  if (sub_category_name_Error.value || main_category_name_Error.value) {
    return
  }

  isLoading.value = true

  const data = {
    name: sub_category_name.value,
    color: sub_category_color.value,
    main: {
      url: main_category.value
    }
  }
  try {
    let response;
    if (!props.isEdit) {
      response = await axios.post("http://localhost:2280/api/v1/categories/sub/new", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (response.status === 201) {
        emitter.emit('alertSuccess', response.data.message);
      }
    } else {
      response = await axios.put(`http://localhost:2280/api/v1/categories/sub/edit/${props.subCategory.id}`, data, {
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
    isLoading.value = false;
    emit('refreshData');
  }
}

const deleteSubCategory = async () => {
  isLoading.value = true
  try {
    const response = await axios.delete(`http://localhost:2280/api/v1/categories/sub/delete/${props.subCategory.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    if (response.status === 200) {
      emitter.emit('alertSuccess', response.data.message)
    }

  } catch (err) {
    console.error(err)
  } finally {
    closeModal()
    emit('refreshData');
    isLoading.value = false
  }
}

onMounted(() => {
  getMainCategories()
})

watch(() => props.subCategory, (newVal) => {
  try {
    getMainCategories()
  } catch (err) {
    console.error(err)
  }
  if (props.isEdit && props.subCategory) {
    main_category.value = props.mainCategory.url
    sub_category_name.value = newVal.name
    sub_category_color.value = newVal.color
  } else {
    sub_category_name.value = ""
    sub_category_color.value = '#d4f7f3'
  }
})

</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <alert-component></alert-component>
  <form @submit.prevent="save">
    <div class="modal-dialog modal-fullscreen">
      <div id="sub_category" aria-hidden="true" aria-labelledby="staticBackdropLabel" class="modal fade"
           data-bs-backdrop="static"
           data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 id="staticBackdropLabel" class="modal-title fs-5">{{ props.isEdit ? 'Edit' : 'New' }} Sub
                Category</h1>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
              <!-- Main category name -->
              <div class="form-floating mb-3">
                <select id="main_category_name" v-model="main_category" class="form-select"
                        name="main_category_name"
                        @change="validateMainCategory">
                  <option v-for="main_category in main_categories" :key="main_category.id" :value="main_category.url">
                    {{ main_category.name }}
                  </option>
                </select>
                <label for="main_category_name">Main category name</label>
                <span v-if="main_category_name_Error" class="text-danger">{{ main_category_name_Error }}</span>
              </div>
              <!-- Sub category name -->
              <div class="form-floating mb-3">
                <input id="name" v-model="sub_category_name" class="form-control" placeholder="name"
                       @change="validateSubCategory">
                <label for="name">Sub category name</label>
                <span v-if="sub_category_name_Error" class="text-danger">{{ sub_category_name_Error }}</span>
              </div>
              <!-- Color for category -->
              <div class="form-floating mb-3">
                <input id="exampleColorInput" v-model="sub_category_color" class="form-control"
                       title="Choose your color"
                       type="color" value="#d4f7f3">
                <label class="t-1 form-label" for="exampleColorInput">Color picker</label>
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
label.t-1 {
  top: -1px !important;
}
</style>
