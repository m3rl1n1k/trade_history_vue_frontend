<script setup>
</script>

<template>
  <div class="wrapper">
    <div class="col-6">
      <h2 class="text-center lh-base mb-5">Simple App for calculate own <span
          class="text-bg-primary p-1 rounded-2 ">finance</span>
      </h2>
      <div class="row text-center g-2 gy-sm-3">
        <div class="col">
          <router-link class="btn btn-success" to="/login">Login</router-link>
        </div>
        <div class="col">
          <router-link class="btn btn-outline-success" to="/register">Registration</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>