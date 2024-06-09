<template>
  <q-layout view="hHh LpR lFr">
    <q-header elevated class="bg-grey-9 text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title
          :style="{
            fontSize: '60px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }"
        >
          <q-avatar size="100px" :style="{ marginRight: '20px' }">
            <img src="/header.png" />
          </q-avatar>
          GYM
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="person"
          size="lg"
          @click="toggleRightDrawer"
        />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/home" label="inicio" />
        <!-- <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" /> -->
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
      <router-link
        to="/usuarios"
        class="drawer-link"
        active-class="drawer-link-active"
        >Usuarios</router-link
      >
      <router-link
        to="/ingresos"
        class="drawer-link"
        active-class="drawer-link-active"
        >Ingresos</router-link
      >
      <router-link
        to="/clientes"
        class="drawer-link"
        active-class="drawer-link-active"
        >Clientes</router-link
      >
      <router-link
        to="/planes"
        class="drawer-link"
        active-class="drawer-link-active"
        >Planes</router-link
      >
      <router-link
        to="/maquinas"
        class="drawer-link"
        active-class="drawer-link-active"
        >Maquinas</router-link
      >
      <router-link
        to="/sedes"
        class="drawer-link"
        active-class="drawer-link-active"
        >Sedes</router-link
      >
      <router-link
        to="/pagos"
        class="drawer-link"
        active-class="drawer-link-active"
        >Pagos</router-link
      >
      <router-link
        to="/inventario"
        class="drawer-link"
        active-class="drawer-link-active"
        >Inventario</router-link
      >
      <router-link
        to="/ventas"
        class="drawer-link"
        active-class="drawer-link-active"
        >Ventas</router-link
      >
      <router-link
        to="/mantenimientos"
        class="drawer-link"
        active-class="drawer-link-active"
        >Mantenimientos</router-link
      >
      <br />
      <!-- drawer content -->
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay elevated>
      <div v-if="usuario" class="q-pa-md">
        <h4 class="text-center">PERFIL</h4>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Nombre</q-item-label>
              <q-item-label>{{ usuario.nombre }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Email</q-item-label>
              <q-item-label>{{ usuario.email }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Teléfono</q-item-label>
              <q-item-label>{{ usuario.telefono }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="work" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Rol</q-item-label>
              <q-item-label>{{ usuario.rol }}</q-item-label>
            </q-item-section>
          </q-item>
          <div class="text-center q-my-md">
            <q-btn
              label="Cerrar sesión"
              color="red"
              size="md"
              @click="cerrarSesion"
            />
          </div>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <q-footer :reveal="true" elevated class="bg-grey-10 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="footer-content q-pa-md">
            <p class="q-mb-none">
              Reservado los derechos de autor ley 1987("antonio y el viejo
              chucho")
            </p>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUsuarioStore } from "../stores/usuarios.js";
import { useRouter } from "vue-router";

const usuarioStore = useUsuarioStore();
const router = useRouter();

const usuario = computed(() => usuarioStore.usuario);

onMounted(() => {
  if (usuarioStore.token) {
    // rightDrawerOpen.value = true;
  }
});

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

const cerrarSesion = () => {
  usuarioStore.clearUsuario();
  router.push({ name: "login" });
};


</script>
<style scoped>
.drawer-link {
  display: block;
  padding: 10px 20px;
  color: black; /* Cambia el color del texto */
  text-decoration: none; /* Elimina el subrayado */
  transition: background-color 0.3s;
  font-size: 25px;
  text-align: center;
}

.drawer-link:hover {
  background-color: #5c868b; /* Cambia el color de fondo al pasar el mouse */
}

.drawer-link-active {
  background-color: #6c6e6f; /* Color de fondo para el enlace activo */
}

.q-btn {
  font-size: 24px; /* Aumenta el tamaño del texto en el botón */
  padding: 12px; /* Ajusta el padding para hacerlo más grande */
}

.q-icon {
  font-size: 36px; /* Aumenta el tamaño del icono */
}

.text-center {
  text-align: center;
}

.footer-content {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* Alinea el texto a la izquierda */
}
</style>