<script setup>
import SidebarComponent from "@/components/SidebarComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import MainCategoryFormComponent from "@/components/forms/MainCategoryFormComponent.vue";
import SubCategoryFormComponent from "@/components/forms/SubCategoryFormComponent.vue";
import {onMounted, ref} from "vue";
import axios from "axios";

const isLoading = ref(false);
const mainCategories = ref([]);
const selectedMainCategory = ref(null);
const selectedSubCategory = ref(null);
const isEditMain = ref(false);
const isEditSub = ref(false);

const getMainCategories = () => {
  try {
    isLoading.value = true;
    axios.get("http://localhost:2280/api/v1/categories/main", {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      }
    }).then(response => {
      mainCategories.value = response.data.main_categories;
    })
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getMainCategories();
});
const openModal = (modal_id) => {
  const modal = new bootstrap.Modal(document.getElementById(modal_id));
  modal.show();
}

const openEditMainModal = (mainCategory) => {
  selectedMainCategory.value = mainCategory;
  isEditMain.value = true
  openModal('main_category')
};

const openEditSubModal = (mainCategory, subCategory) => {
  selectedSubCategory.value = subCategory;
  selectedMainCategory.value = mainCategory
  isEditSub.value = true
  openModal('sub_category')
};
</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <header-component></header-component>
  <sidebar-component></sidebar-component>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Categories</h1>
      <div>Add:
        <a class="link-primary text-decoration-none cursor-pointer"
           @click="selectedMainCategory=null, isEditMain = false, openModal('main_category')">main</a> |
        <a class="link-primary text-decoration-none cursor-pointer"
           @click="selectedSubCategory=null, isEditSub = false, openModal('sub_category')">sub</a>
        category
      </div>
    </div>
    <div v-if="mainCategories.length > 0">
      <div class="row">
        <div v-for="mainCategory in mainCategories" :key="mainCategory.id" class="col-sm-12 col-lg-3 col-md-4 mb-4">
          <div class="card">
            <div :style="[mainCategory.color ? 'background:'+ mainCategory.color:'']"
                 class="card-header" @click="openEditMainModal(mainCategory)">
              {{ mainCategory.name }}
            </div>
            <ul v-if="mainCategory.categories.length > 0" class="list-group list-group-flush">
              <li v-for="(subCategory) in mainCategory.categories" :key="subCategory.id"
                  class="list-group-item" @click="openEditSubModal(mainCategory,subCategory)">
                {{ subCategory.name }} <span :style="[subCategory.color ? 'background:'+ subCategory.color:'']"
                                             class="color-tester"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Not have records:
      <a class="cursor-pointer" @click="openModal('main_category')">Add one</a>
    </div>
  </main>
  <main-category-form-component
      :is-edit="isEditMain"
      :main-category="selectedMainCategory"
      @refreshData="getMainCategories"
  ></main-category-form-component>
  <sub-category-form-component
      :is-edit="isEditSub"
      :main-category="selectedMainCategory"
      :sub-category="selectedSubCategory"
      @refreshData="getMainCategories"
  ></sub-category-form-component>
</template>


<style scoped>
span.color-tester {
  float: right;
  display: block;
  height: 1rem;
  width: 2rem;
}
</style>