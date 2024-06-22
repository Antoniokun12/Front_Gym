<template>
  <div class="reset-password-container">
    <div class="reset-password-background"></div>
    <div class="reset-password-form">
      <h2 class="form-title">Restablecer contraseña</h2>
      <q-form @submit.prevent="resetPassword">
        <q-input
          filled
          class="input"
          type="password"
          v-model="newPassword"
          label="Nueva contraseña"
        />
        <q-input
          filled
          class="input"
          type="password"
          v-model="confirmPassword"
          label="Confirmar contraseña"
        />
        <div class="button-container">
          <q-btn
            label="Guardar nueva contraseña"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Notify } from "quasar";

const newPassword = ref("");
const confirmPassword = ref("");

function resetPassword() {
  if (!newPassword.value || !confirmPassword.value) {
    mostrarNotificacion("Por favor, complete todos los campos.", "negative");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    mostrarNotificacion("Las contraseñas no coinciden.", "negative");
    return;
  }



  // Simulación de éxito
  Notify.create({
    message: "Contraseña restablecida exitosamente.",
    color: "positive",
    position: "top"
  });

 
  newPassword.value = "";
  confirmPassword.value = "";
}

function mostrarNotificacion(mensaje, color = "negative") {
  Notify.create({
    message: mensaje,
    color: color,
    position: "top",
    icon: "sentiment_dissatisfied"
  });
}
</script>

<style scoped>
.reset-password-container {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.reset-password-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://t4.ftcdn.net/jpg/06/31/52/63/360_F_631526348_iyXBhrHcirGz44bTZejMB1IVAjmdUp92.jpg");
  background-size: cover;
  background-position: center;
  opacity: 0.9;
}

.reset-password-form {
  position: relative;
  z-index: 1;
  max-width: 400px;
  padding: 20px;
  background: rgba(30, 29, 29, 0.9);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #f9f9f9;
}

.form-title {
  text-align: center;
  margin-bottom: 40px;
}

.input {
  background-color: #f9f9f9;
  margin-bottom: 15px; 
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

