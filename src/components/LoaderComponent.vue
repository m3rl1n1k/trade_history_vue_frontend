<template>
  <div v-if="visible" class="loader-overlay">
        <span class="loader"></span>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.42);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

@keyframes spin-load {
  to {
    transform: rotateZ(360deg);
  }
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin-load 1s linear infinite;
}

</style>