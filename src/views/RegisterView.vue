<script setup>
import ColorModeComponent from "@/components/ColorModeComponent.vue";
import {RouterLink, useRouter} from 'vue-router';
import {onMounted, ref, watch} from "vue";
import axios from 'axios'; // Додайте цей імпорт для axios
import emitter from "@/eventBus.js";
import AlertComponent from "@/components/AlertComponent.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const re_password = ref("");  // Додайте змінну для підтвердження пароля
const isLoading = ref(false);
const emailError = ref("");
const passwordError = ref("");
const rePasswordError = ref("");  // Додайте змінну для помилки підтвердження пароля

onMounted(() => {
  if (sessionStorage.getItem('token')) {
    router.push('dashboard');
  }
});

watch(email, (value) => {
  validateEmail(value);
});

watch(password, (value) => {
  validatePassword(value);
});

watch(re_password, (value) => {
  validatePassword(value);
});

function validateEmail(value) {
  const re = /\S+@\S+\.\S+/;
  if (!value) {
    emailError.value = 'Email is required';
  } else if (!re.test(value)) {
    emailError.value = 'Email is not valid';
  } else {
    emailError.value = '';
  }
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = 'Password is required';
  } else {
    passwordError.value = '';
  }

  if (!re_password.value) {
    rePasswordError.value = 'Confirmation password is required';
  } else if (password.value !== re_password.value) {
    rePasswordError.value = 'Passwords don\'t match';
  } else {
    rePasswordError.value = '';
  }
}

async function SignUp() {
  validateEmail(email.value);
  validatePassword();
  if (emailError.value || passwordError.value || rePasswordError.value) {
    return;
  }
  isLoading.value = true;

  const errorHandle = (err) => {
    if (err.response) {
      const {status} = err.response;
      if (status === 201) {
        router.push('login');
      } else if (status === 400) {
        emitter.emit('alertDanger', 'Email is taken');
      } else {
        emitter.emit('alertDanger', "Server has error");
      }
    }
  }

  try {
    const response = await axios.post('https://151.20.114.2/api/v1/registration', {
      email: email.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    await router.push('login');
    emitter.emit('alertSuccess', response.data.message);
  } catch (err) {

    errorHandle(err);
  } finally {
    isLoading.value = false;
  }

}
</script>

<template>
  <main class="form-signin w-100 m-auto align-content-center align-items-center min-vh-100 ">
    <form @submit.prevent="SignUp">
      <h1 class="h3 mb-3 fw-normal">Sign up</h1>

      <!--email-->
      <div class="form-floating mb-2">
        <input id="email" v-model="email" autocomplete="on" class="form-control"
               name="email"
               placeholder="name@example.com"
               type="email"
               @change="validateEmail">
        <label for="email">Email address</label>
        <span v-if="emailError" class="text-danger">{{ emailError }}</span>
      </div>
      <!--   password   -->
      <div class="form-floating mb-2">
        <input id="floatingPassword" v-model="password" class="form-control" name="password"
               placeholder="Password"
               type="password"
               @change="validatePassword">
        <label for="floatingPassword">Password</label>
        <span v-if="passwordError" class="text-danger ">{{ passwordError }}</span>
      </div>
      <!--      repeat password -->
      <div class="form-floating mb-2">
        <input id="repeat_pass" v-model="re_password" class="form-control" name="repeat_password"
               placeholder="Repeat password"
               type="password"
               @change="validatePassword">
        <label for="repeat_pass">Repeat password</label>
        <span v-if="rePasswordError" class="text-danger ">{{ rePasswordError }}</span>
      </div>
      <!--      buttons -->
      <div class="row">
        <div class="col-md-6 col-sm-12 mt-sm-2 mt-2">
          <button class="btn btn-success w-100 py-2" type="submit">Registration</button>
        </div>
        <div class="col-md-6 col-sm-12 mt-sm-2 mt-2">
          <RouterLink class="btn btn-outline-primary w-100 py-2" to="/login">Login</RouterLink>
        </div>
      </div>
      <alert-component></alert-component>
    </form>
  </main>

  <color-mode-component></color-mode-component>
</template>

<style scoped>

</style>