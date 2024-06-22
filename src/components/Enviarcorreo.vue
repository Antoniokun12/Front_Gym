<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form">
      <h2>Recuperar contraseña</h2>
      <q-form @submit.prevent="enviarCorreo">
        <q-input
          filled
          class="input"
          v-model="email"
          label="Ingrese su correo electrónico registrado"
        />
        <div class="button-container">
          <q-btn
            label="Enviar correo de recuperación"
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

const email = ref("");

const requiredRule = (value) => !!value || "Este campo es requerido";

function enviarCorreo() {
  if (!email.value) {
    mostrarNotificacion("Por favor, ingrese su correo electrónico.", "negative");
    return;
  }
  // Validación simple para verificar si el formato del correo es válido
  if (!isValidEmailFormat(email.value)) {
    mostrarNotificacion("El formato del correo electrónico no es válido.", "negative");
    return;
  }

  Notify.create({
    message: `Correo de recuperación enviado a ${email.value}`,
    color: "positive",
    position: "top",
  });
  
}
function isValidEmailFormat(email) {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://e1.pxfuel.com/desktop-wallpaper/391/391/desktop-wallpaper-3840x2160-dumbbells-fitness-gym-u-16-9-weights.jpg");
  background-size: cover;
  background-position: center;
  color: white;
  margin: 0;
}

.forgot-password-form {
  max-width: 400px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7); 
  border-radius: 8px;
}

.input {
  color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>






