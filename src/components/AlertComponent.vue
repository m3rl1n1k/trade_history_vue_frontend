<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import emitter from '../eventBus';

const alertOpenDanger = ref(false);
const alertOpenSuccess = ref(false);
const message = ref('');

function showAlertDanger(newMessage, timeout_s = 4) {
  message.value = newMessage;
  alertOpenDanger.value = true;
  setTimeout(() => {
    closeAlert();
  }, timeout_s * 9000); // Автоматичне закриття через 3 секунди
}
function showAlertSuccess(newMessage, timeout_s = 4) {
  message.value = newMessage;
  alertOpenSuccess.value = true;
  setTimeout(() => {
    closeAlert();
  }, timeout_s * 9000); // Автоматичне закриття через 3 секунди
}

function closeAlert() {
  alertOpenDanger.value = false;
  alertOpenSuccess.value = false;
}

onMounted(() => {
  emitter.on('alertSuccess', showAlertSuccess);
  emitter.on('alertDanger', showAlertDanger);
});

onUnmounted(() => {
  emitter.off('alertSuccess', showAlertSuccess);
  emitter.off('alertDanger', showAlertDanger);
});
</script>

<template>
  <div v-if="alertOpenDanger" class="alert alert-danger alert-dismissible fade show mt-2 fixed-bottom"
       role="alert">
    {{ message }}
    <button aria-label="Close" class="btn-close" data-bs-dismiss="alert" type="button"
            v-on:click="closeAlert()"></button>
  </div>

  <div v-if="alertOpenSuccess" class="alert alert-success alert-dismissible fade show mt-2 fixed-bottom"
       role="alert">
    {{ message }}
    <button aria-label="Close" class="btn-close" data-bs-dismiss="alert" type="button"
            v-on:click="closeAlert()"></button>
  </div>
</template>

<style scoped>

</style>