<script setup>

import ColorModeComponent from "@/components/ColorModeComponent.vue";
import IconsComponent from "@/components/IconsComponent.vue";
import router from "@/router/index.js";

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login")
}

</script>

<template>
  <icons-component></icons-component>
  <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
    <div id="sidebarMenu" aria-labelledby="sidebarMenuLabel" class="offcanvas-md offcanvas-end bg-body-tertiary"
         tabindex="-1">
      <div class="offcanvas-header">
        <h5 id="sidebarMenuLabel" class="offcanvas-title">Company name</h5>
        <button aria-label="Close" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu"
                type="button"></button>
      </div>
      <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
        <ul class="nav flex-column">
          <li class="nav-item">
            <RouterLink aria-current="page" class="nav-link d-flex align-items-center gap-2 active" href="#"
                        to="/dashboard">
              <svg class="bi">
                <use xlink:href="#house-fill"></use>
              </svg>
              Dashboard
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link d-flex align-items-center gap-2" href="#" to="/transactions">
              <svg class="bi">
                <use xlink:href="#file-earmark"></use>
              </svg>
              Transitions
            </RouterLink>
          </li>
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center gap-2" href="#" to="/wallets">
              <svg class="bi">
                <use xlink:href="#cart"></use>
              </svg>
              Wallets
            </router-link>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link d-flex align-items-center gap-2" href="#" to="/profile">
              <svg class="bi">
                <use xlink:href="#people"></use>
              </svg>
              Profile
            </RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-2" href="#">
              <svg class="bi">
                <use xlink:href="#graph-up"></use>
              </svg>
              Reports
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-2" href="#">
              <svg class="bi">
                <use xlink:href="#puzzle"></use>
              </svg>
              Integrations
            </a>
          </li>
        </ul>

        <hr class="my-3">

        <ul class="nav flex-column mb-auto">
          <li class="nav-item">
            <RouterLink class="nav-link d-flex align-items-center gap-2" href="#" to="/settings">
              <svg class="bi">
                <use xlink:href="#gear-wide-connected"></use>
              </svg>
              Settings
            </RouterLink>
          </li>
          <li class="nav-item">
            <button class="nav-link d-flex align-items-center gap-2" href="#" @click="logout">
              <svg class="bi">
                <use xlink:href="#door-closed"></use>
              </svg>
              Sign out
            </button>
          </li>
        </ul>
      </div>
      <color-mode-component></color-mode-component>
    </div>
  </div>
</template>

<style scoped>
.bi {
  display: inline-block;
  width: 1rem;
  height: 1rem;
}

/*
 * Sidebar
 */

@media (min-width: 768px) {
  .sidebar {
    position: -webkit-sticky;
    position: sticky;
    top: 48px;
    height: calc(100vh - 50px)
  }
}

.sidebar .nav-link {
  font-size: .875rem;
  font-weight: 500;
}

.sidebar .nav-link.active {
  color: #2470dc;
}


/*
 * Navbar
 */
</style>