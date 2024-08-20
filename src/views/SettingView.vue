<script setup>
import {ref} from "vue";
import AlertComponent from "@/components/AlertComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";

const isLoading = ref(false)
const settings = JSON.parse(localStorage.getItem('settings'))

console.log(settings)

// todo: make form for settings
// todo: save settings
</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <header-component></header-component>
  <sidebar-component></sidebar-component>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between
    flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Settings</h1>
    </div>


    <alert-component></alert-component>
  </main>
</template>

<style scoped>

</style>