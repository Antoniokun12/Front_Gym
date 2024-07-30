<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Usuarios</div>
      <q-btn
        label="Agregar Usuario"
        color="primary"
        @click="showForm = true"
        class="q-my-md"
      />
      <q-btn-dropdown
        color="primary"
        icon="visibility"
        label="Filtrar"
        style="margin-left: 16px"
      >
        <q-list>
          <q-item clickable v-ripple @click="listarUsuarios">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarUsuariosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarUsuariosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedUserId"
        label="Seleccionar Usuario"
        :options="userOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerUsuarioPorID"
      />
    </div>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="_id"
            flat
            bordered
            square
            no-data-label=""
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarUsuario(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Editar Usuario
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarUsuario(props.row)"
                  v-if="props.row.estado == 0"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Activar
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="desactivarUsuario(props.row)"
                  v-if="props.row.estado == 1"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Desactivar
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-chip :color="props.row.estado == 1 ? 'green' : 'red'" dark>
                  {{ props.row.estado == 1 ? "Activo" : "Inactivo" }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="q-pa-md text-center">
                <q-icon
                  name="sentiment_dissatisfied"
                  size="lg"
                  class="q-mr-sm"
                />
                <div class="text-h6">No hay Usuarios disponibles</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card>
          <q-card-section>
            <q-form @submit.prevent="agregarOEditarUsuario">
              <h1 style="font-size: 30px; text-align: center; margin: 0;  line-height: 50px;">Usuario</h1>
              <q-select
                v-model="sede"
                label="Sede"
                :options="sedesOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input v-model.trim="nombre" label="Nombre Usuario" required />
              <q-input v-model.trim="email" label="Email" required/>
              <q-input v-model.trim="telefono" label="Teléfono" required/>
              <q-input
                v-if="!isEditing"
                v-model.trim="password"
                label="Contraseña"
                required
              />
              <q-select v-model="rol" label="Rol" :options="roles" />
              <div style="margin-top: 15px;">
                <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarUsuario"
                class="q-mr-sm"
              />
              <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useUsuarios.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUsuarioStore } from "../stores/usuarios.js";
import { useSedeStore } from "../stores/sedes.js";

const useUsuarios = useUsuarioStore();
const useSedes = useSedeStore();

const showForm = ref(false);
const sede = ref("");
const nombre = ref("");
const email = ref("");
const telefono = ref("");
const password = ref("");
const rol = ref("");
const selectedUserId = ref("");
const usuarioId = ref(null); // Para almacenar el ID del usuario en edición

const isEditing = ref(false);

const roles = ref(["Administrador", "Recepcionista", "Instructor"]);
const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre Usuario", align: "center", field: "nombre" },
  { name: "email", label: "Email", align: "center", field: "email" },
  { name: "telefono", label: "Teléfono", align: "center", field: "telefono" },
  { name: "rol", label: "Rol", align: "center", field: "rol" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const sedesOptions = ref([]);
const userOptions = ref([]);

async function listarUsuarios() {
  try {
    const r = await useUsuarios.getUsuarios();
    rows.value = r.usuarios;
    userOptions.value = r.usuarios.map((usuario) => ({
      label: usuario.nombre,
      value: usuario._id,
    }));
    console.log(r);
  } catch (error) {
    console.error(error);
  }
}

async function listarUsuariosActivos() {
  try {
    const r = await useUsuarios.getUsuariosActivos();
    rows.value = r.usuariosActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarUsuariosInactivos() {
  try {
    const r = await useUsuarios.getUsuariosInactivos();
    rows.value = r.usuariosInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarUsuario() {
  try {
    const data = {
      sede: sede.value,
      nombre: nombre.value,
      email: email.value,
      telefono: telefono.value,
      password: password.value,
      rol: rol.value,
    };

    let result;

    if (usuarioId.value) {
      result = await useUsuarios.putUsuario(usuarioId.value, data);
    } else {
      result = await useUsuarios.postUsuario(data);
    }
    console.log("Operation result:", result); // Verifica el resultado

    if (result.success) {
      listarUsuarios(); // Actualiza la lista de usuarios después de agregar o editar
      showForm.value = false; // Cierra el formulario solo si la operación fue exitosa
    }
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarUsuario() {
  showForm.value = false;
  isEditing.value = false;
}

function editarUsuario(usuario) {
  // Llenar el formulario con los datos del usuario a editar
  sede.value = usuario.sede;
  nombre.value = usuario.nombre;
  email.value = usuario.email;
  telefono.value = usuario.telefono;
  rol.value = usuario.rol;
  usuarioId.value = usuario._id; // Almacenar el ID del usuario
  isEditing.value = true;
  showForm.value = true;
}

async function activarUsuario(usuario) {
  try {
    await useUsuarios.toggleEstadoUsuario(usuario._id, true);
    listarUsuarios(); // Actualiza la lista de usuarios después de cambiar el estado
  } catch (error) {
    console.error(error);
  }
}

async function desactivarUsuario(usuario) {
  try {
    await useUsuarios.toggleEstadoUsuario(usuario._id, false);
    listarUsuarios(); // Actualiza la lista de usuarios después de cambiar el estado
  } catch (error) {
    console.error(error);
  }
}

async function obtenerSedes() {
  try {
    const res = await useSedes.getSedes();
    sedesOptions.value = res.sede.map((sede) => {
      console.log(`Sede ID: ${sede._id}`); // Log para verificar el formato
      return {
        label: sede.nombre,
        value: sede._id, // Asegúrate de que este es un ObjectId válido
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function obtenerUsuarioPorID(userId) {
  try {
    const usuario = await useUsuarios.getUsuarioByID(userId);
    rows.value = [usuario]; // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

watch(showForm, (newValue) => {
  if (!newValue) {
    sede.value = "";
    nombre.value = "";
    email.value = "";
    telefono.value = "";
    password.value = "";
    rol.value = "";
    usuarioId.value = null;
    isEditing.value = false;
  }
});

obtenerSedes();
listarUsuarios();
</script>

<style scoped>
.q-card-section {
  padding: 20px;
}

.q-btn {
  margin-right: 5px;
}

.text-center {
  text-align: center;
}

.q-icon {
  font-size: 3rem;
}

.text-h6 {
  font-size: 1.5rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
