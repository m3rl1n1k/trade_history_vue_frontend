<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import AlertComponent from "@/components/AlertComponent.vue";
import emitter from "@/eventBus.js";
import SidebarComponent from "@/components/SidebarComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";

const isLoading = ref(false)
const getSetting = () => {
  try {
    isLoading.value = true
    axios.get("http://localhost:2280/api/v1/settings/ ", {
      headers: {
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      }
    }).then(response => {
      const settings = response.data.setting.setting
      emitter.emit("alertSuccess", settings);
    })
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getSetting()
})
</script>

<template>
  <loader-component :visible="isLoading"></loader-component>
  <header-component></header-component>
  <sidebar-component></sidebar-component>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Settings</h1>
    </div>
    <alert-component></alert-component>
  </main>
</template>

<style scoped>

</style>