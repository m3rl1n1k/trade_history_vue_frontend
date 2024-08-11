<script setup>

</script>

<template>
  <svg class="d-none" xmlns="http://www.w3.org/2000/svg">
    <symbol id="list" viewBox="0 0 16 16">
      <path
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          fill-rule="evenodd"></path>
    </symbol>
  </svg>
  <header class="navbar sticky-top bg-dark flex-md-nowrap py-2 shadow p-0">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">Trade history</a>
    <ul class="navbar-nav flex-row d-md-none">
      <li class="nav-item text-nowrap">
        <button aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation"
                class="nav-link px-3 text-white"
                data-bs-target="#sidebarMenu" data-bs-toggle="offcanvas" type="button">
          <svg class="bi">
            <use xlink:href="#list"></use>
          </svg>
        </button>
      </li>
    </ul>
  </header>
</template>

<style scoped>
svg {
  height: 23px;
  width: 27px;
}
</style>