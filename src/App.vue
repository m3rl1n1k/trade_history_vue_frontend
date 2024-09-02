<script setup>

import {RouterView} from 'vue-router'

import axios from 'axios';
import emitter from "@/eventBus.js";
import {onMounted, ref} from "vue";
import router from "@/router/index.js";


const isLoading = ref(false)
const settings = ref("")
// Ваш глобальний emitter для обробки подій
const excludedPaths = ['/login', '/register'];
axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        const currentPath = router.currentRoute.value.fullPath;

        // Перевірка, чи поточний шлях у списку виключень
        if (!excludedPaths.includes(currentPath)) {
          // Якщо шлях не у списку виключень, викликати подію завершення сесії
          emitter.emit('sessionExpired');
        }
      }
      return Promise.reject(error);
    }
);
onMounted(() => {
  getSetting()
  emitter.on('sessionExpired', () => {
    // Показати модальне вікно або зробити перенаправлення на сторінку логіну
    const modal = document.getElementById('sessionExpiredModal');
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  });
});

const getSetting = async () => {
  try {
    isLoading.value = true
    let response;
    response = await axios.get("https://51.20.114.2/api/v1/settings/ ", {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      }
    })

    if (response.status === 200) {
      localStorage.setItem('settings', JSON.stringify(response.data.setting.setting))
    }
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false
  }
}
</script>

<template>

  <div class="container-fluid">
    <div class="row">
      <RouterView/>
    </div>
  </div>

  <div id="sessionExpiredModal" aria-hidden="true" aria-labelledby="sessionExpiredModalLabel" class="modal fade"
       tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="sessionExpiredModalLabel" class="modal-title">Session Ended</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          Your session has ended. Please log in again to continue.
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.location='/login';" type="button">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.cursor-pointer:hover {
  cursor: pointer;
}
</style>
