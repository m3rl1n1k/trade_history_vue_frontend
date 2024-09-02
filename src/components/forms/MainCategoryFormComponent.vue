<script setup>
import LoaderComponent from '@/components/LoaderComponent.vue';
import AlertComponent from '@/components/AlertComponent.vue';
import {ref, watch} from "vue";
import axios from "axios";
import emitter from "@/eventBus.js";

const isLoading = ref(false)
const main_category_name = ref("")
const main_category_name_Error = ref("")
const main_category_color = ref('#d4f7f3');

const emit = defineEmits(['refreshData'])

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  mainCategory: {
    type: Object,
  }
})

const closeModal = () => {
  const modal = document.getElementById('main_category'); // Змініть на ID вашого модального вікна
  const modalInstance = bootstrap.Modal.getInstance(modal);
  if (modalInstance) {
    modalInstance.hide();
  }
}
const validateMainCategory = () => {

  if (!main_category_name.value)
    main_category_name_Error.value = "Main category name can't be empty"
  else
    main_category_name_Error.value = ''
}
const save = async () => {
  validateMainCategory()
  if (!main_category_name.value) {
    return
  }
  isLoading.value = true

  const data = {
    name: main_category_name.value,
    color: main_category_color.value,
  }
  try {
    let response;
    if (!props.isEdit) {
      response = await axios.post("https://51.20.114.2/api/v1/categories/main/new", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (response.status === 201) {
        emitter.emit('alertSuccess', response.data.message);
      }
      if (response.status === 400) {
        emitter.emit('alertDanger', response.data.message);
      }
    } else {
      response = await axios.put(`https://51.20.114.2/api/v1/categories/main/edit/${props.mainCategory.id}`, data, {
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
    closeModal()
    isLoading.value = false;
    emit('refreshData');
  }
}

const deleteMainCategory = async () => {
  isLoading.value = true
  try {
    const response = await axios.delete(`https://51.20.114.2/api/v1/categories/main/delete/${props.mainCategory.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    console.log(response.data)
    if (response.status === 200) {
      emitter.emit('alertSuccess', response.data.message)
    }
    if (response.status === 400) {
      emitter.emit('alertDanger', response.data.message)
    }

  } catch (err) {
    console.error(err)
    emitter.emit('alertDanger', 'An error occurred while deleting the data.')
  } finally {
    closeModal()
    emit('refreshData');
    isLoading.value = false
  }
}

watch(() => props.mainCategory, (newVal) => {
  if (props.isEdit && props.mainCategory) {
    main_category_name.value = newVal.name
    main_category_color.value = newVal.color
  } else {
    main_category_name.value = ""
    main_category_color.value = '#d4f7f3'
  }
})
</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <alert-component></alert-component>
  <form @submit.prevent="save">
    <div class="modal-dialog modal-fullscreen">
      <div id="main_category" aria-hidden="true" aria-labelledby="staticBackdropLabel" class="modal fade"
           data-bs-backdrop="static"
           data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 id="staticBackdropLabel" class="modal-title fs-5">
                {{ props.isEdit ? "Edit" : "New" }} Main category
              </h1>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
              <!-- Main category name -->
              <div class="form-floating mb-3">
                <input id="name" v-model="main_category_name" class="form-control" placeholder="name"
                       @change="validateMainCategory">
                <label for="name">Main category name</label>
                <span v-if="main_category_name_Error" class="text-danger">{{ main_category_name_Error }}</span>
              </div>
              <!-- Color for category -->
              <div class="form-floating mb-3">
                <input id="exampleColorInput" v-model="main_category_color" class="form-control"
                       title="Choose your color"
                       type="color" value="#d4f7f3">
                <label class="t-1 form-label" for="exampleColorInput">Color picker</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
              <button v-if="props.isEdit" class="btn btn-danger" type="button" @click="deleteMainCategory">Delete
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
