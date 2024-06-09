<template>
  <div class="login-container">
    <div class="q-pa-md" style="max-width: 400px">
      <h1 class="titulo">GymApp</h1>
      <q-form class="q-gutter-md">
        <q-input
          filled
          class="input"
          v-model="email"
          label="ingrese su correo electronico *"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor ingrese un correo',
            (val) =>
              val.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) ||
              'Por favor ingrese un correo electrónico válido',
          ]"
        />

        <q-input
          filled
          class="input"
          type="text"
          v-model="password"
          label="Ingrese su contraseña"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 1) || 'Por favor ingrese una contraseña',
          ]"
        />
        <div class="button-container">
          <q-btn
            label="Iniciar sesion"
            type="submit"
            color="primary"
            @click="loginUsuario()"
          />
          <!-- <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          /> -->
        </div>
      </q-form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuarios.js";
import { useRouter } from "vue-router";

let useUsuarios = useUsuarioStore();

const email = ref("");
const password = ref("");
const router = useRouter();
let l = null;
// const accept = ref(false);

async function loginUsuario() {
  try {
    let data = {
      email: email.value,
      password: password.value,
    };
    const loginSuccessful = await useUsuarios.login(data);

    if (loginSuccessful) {
      router.push("/home"); // Redirige a la ruta deseada después del inicio de sesión exitoso
      onReset();
    } else {
      // Manejar el caso en que el inicio de sesión no fue exitoso
      console.log("Inicio de sesión fallido");
      onReset();
    }
  } catch (error) {
    console.error(error);
  }
}

const onReset = () => {
  email.value = "";
  password.value = "";
};
</script>
<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("/fondoGym.jpg");
  background-size: cover;
  color: white;
}

.titulo {
  font-family: "Roboto", sans-serif;
  font-size: 70px;
  font-weight: bold;
}

.input {
  background-color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px; /* Ajusta el margen superior según sea necesario */
}
</style>