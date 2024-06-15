<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Clientes</div>
      <q-btn
        label="Agregar Cliente"
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
          <q-item clickable v-ripple @click="listarClientes">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarClientesActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarClientesInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedClieId"
        label="Seleccionar Cliente"
        :options="ClieOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerClientePorID"
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
                  @click="editarCliente(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarCliente(props.row)"
                  v-if="props.row.estado === 0"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="desactivarCliente(props.row)"
                  v-if="props.row.estado === 1"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="add"
                  @click="prepararAgregarSeguimiento(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="remove_red_eye"
                  @click="verSeguimientos(props.row)"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-chip :color="props.row.estado === 1 ? 'green' : 'red'" dark>
                  {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
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
                <div class="text-h6">No hay clientes disponibles</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Tabla de Seguimientos -->
    <div v-if="clienteSeleccionado" class="q-pa-md seguimiento-table">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Seguimientos de {{ clienteSeleccionado.nombre }}
          </div>
          <q-btn
            flat
            dense
            round
            icon="close"
            @click="cerrarSeguimiento"
            class="close-button"
          />
          <q-table
            :rows="clienteSeleccionado.seguimiento"
            :columns="seguimientoColumns"
            row-key="fecha"
            flat
            bordered
            square
            no-data-label="no hay seguimientos disponibles"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card>
          <q-card-section>
            <q-form @submit="agregarOEditarCliente">
              <q-input
                v-model="cliente.nombre"
                label="Nombre Cliente"
                required
              />
              <q-input
                v-model="cliente.fecha_nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                required
              />
              <q-input
                v-model="cliente.edad"
                label="Edad"
                type="number"
                required
              />
              <q-input v-model="cliente.documento" label="Documento" required />
              <q-input v-model="cliente.direccion" label="Dirección" required />
              <q-input v-model="cliente.telefono" label="Teléfono" required />
              <q-input v-model="cliente.objetivo" label="Objetivo" required />
              <q-input
                v-model="cliente.observaciones_limitaciones"
                label="Observaciones/Limitaciones"
                required
              />
              <q-select
                v-model="cliente.id_plan"
                label="Plan"
                :options="planesOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarCliente"
                class="q-mr-sm"
              />
              <q-btn type="submit" label="Guardar" color="primary" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Nuevo formulario de seguimiento -->
      <q-dialog v-model="showSeguimientoForm">
        <q-card>
          <q-card-section>
            <q-form @submit="agregarSeguimiento">
              <q-input
                v-model="seguimiento.fecha"
                label="Fecha"
                type="date"
                required
              />
              <q-input
                v-model="seguimiento.peso"
                label="Peso"
                type="number"
                required
              />
              <q-input
                v-model="seguimiento.altura"
                label="Altura"
                type="number"
                required
              />
              <q-input
                v-model="seguimiento.imc"
                label="IMC"
                type="number"
                required
              />
              <q-input
                v-model="seguimiento.medida_brazo"
                label="Medida del Brazo"
                type="number"
                required
              />
              <q-input
                v-model="seguimiento.medida_pierna"
                label="Medida de la Pierna"
                type="number"
                required
              />
              <q-input
                v-model="seguimiento.medida_cintura"
                label="Medida de la Cintura"
                type="number"
                required
              />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="showSeguimientoForm = false"
                class="q-my-md"
              />
              <q-btn
                type="submit"
                label="Guardar"
                color="positive"
                class="q-my-md"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useClienteStore } from "../stores/clientes.js";
import { usePlanStore } from "../stores/planes.js";

const useClientes = useClienteStore();
const usePlanes = usePlanStore();
const showForm = ref(false);
const showSeguimientoForm = ref(false); // Estado para mostrar el formulario de seguimiento

const planesOptions = ref([]);
const selectedClieId = ref("");

const cliente = ref({
  nombre: "",
  fecha_nacimiento: "",
  edad: null,
  documento: "",
  direccion: "",
  telefono: "",
  objetivo: "",
  observaciones_limitaciones: "",
  id_plan: "",
  seguimiento: [],
});
const seguimiento = ref({
  // Datos de seguimiento
  fecha: "",
  peso: "",
  altura: "",
  imc: "",
  medida_brazo: "",
  medida_pierna: "",
  medida_cintura: "",
});
const clienteId = ref(null); // Para almacenar el ID del cliente en edición

const clienteSeleccionado = ref(null); // Lista de planes disponibles

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre Cliente", align: "center", field: "nombre" },
  {
    name: "fecha_nacimiento",
    label: "Fecha Nacimiento",
    align: "center",
    field: "fecha_nacimiento",
  },
  { name: "edad", label: "Edad", align: "center", field: "edad" },
  {
    name: "fecha_ingreso",
    label: "Fecha Ingreso",
    align: "center",
    field: "fecha_ingreso",
  },
  {
    name: "fecha_vencimiento",
    label: "Fecha Vencimiento",
    align: "center",
    field: "fecha_vencimiento",
  },
  {
    name: "documento",
    label: "Documento",
    align: "center",
    field: "documento",
  },
  {
    name: "direccion",
    label: "Dirección",
    align: "center",
    field: "direccion",
  },
  { name: "telefono", label: "Teléfono", align: "center", field: "telefono" },
  { name: "objetivo", label: "Objetivo", align: "center", field: "objetivo" },
  {
    name: "observaciones_limitaciones",
    label: "Observaciones/Limitaciones",
    align: "center",
    field: "observaciones_limitaciones",
  },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  {
    name: "id_plan",
    label: "Plan",
    align: "center",
    field: (row) => row.id_plan.descripcion,
  },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const seguimientoColumns = ref([
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  { name: "peso", label: "Peso", align: "center", field: "peso" },
  { name: "altura", label: "Altura", align: "center", field: "altura" },
  { name: "imc", label: "IMC", align: "center", field: "imc" },
  {
    name: "medida_brazo",
    label: "Medida Brazo",
    align: "center",
    field: "medida_brazo",
  },
  {
    name: "medida_pierna",
    label: "Medida Pierna",
    align: "center",
    field: "medida_pierna",
  },
  {
    name: "medida_cintura",
    label: "Medida Cintura",
    align: "center",
    field: "medida_cintura",
  },
]);

const ClieOptions = ref([]);

async function listarClientes() {
  try {
    const r = await useClientes.getClientes();
    rows.value = r.clientes;
    ClieOptions.value = r.clientes.map((cliente) => ({
      label: cliente.nombre,
      value: cliente._id,
    }));
    console.log(r);
  } catch (error) {
    console.error(error);
  }
}

async function listarClientesActivos() {
  try {
    const r = await useClientes.getClientesActivos();
    rows.value = r.clientesActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarClientesInactivos() {
  try {
    const r = await useClientes.getClientesInactivos();
    rows.value = r.clientesInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarCliente() {
  try {
    if (clienteId.value) {
      await useClientes.putCliente(clienteId.value, cliente.value);
    } else {
      await useClientes.postCliente(cliente.value);
    }
    listarClientes();
    showForm.value = false;
  } catch (error) {
    if (error.response) {
      console.error("Error al agregar o editar cliente:", error.response.data);
      console.error("Código de estado:", error.response.status);
      console.error("Cabeceras:", error.response.headers);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }
  }
}

function limpiarFormularioSeguimiento() {
  seguimiento.value = {
    fecha: "",
    peso: "",
    altura: "",
    imc: "",
    medida_brazo: "",
    medida_pierna: "",
    medida_cintura: "",
  };
}

async function agregarSeguimiento() {
  try {
    if (!cliente.value._id) {
      throw new Error("ID de cliente no definido");
    }
    await useClientes.addSeguimiento(cliente.value._id, seguimiento.value);
    listarClientes(); // Actualiza la lista de clientes después de agregar seguimiento
    showSeguimientoForm.value = false;
    limpiarFormularioSeguimiento();
  } catch (error) {
    console.error("Error al agregar seguimiento:", error);
  }
}

function prepararAgregarSeguimiento(clienteData) {
  cliente.value = { ...clienteData };
  showSeguimientoForm.value = true;
  limpiarFormularioSeguimiento();
}

function cancelarAgregarCliente() {
  showForm.value = false;
}

function editarCliente(clienteData) {
  // Llenar el formulario con los datos del cliente a editar
  cliente.value = { ...clienteData };
  clienteId.value = clienteData._id; // Almacenar el ID del cliente
  showForm.value = true;
}

function verSeguimientos(clienteData) {
  clienteSeleccionado.value = clienteData;
  console.log("Seguimientos del cliente:", clienteData.seguimiento);
  // Aquí puedes implementar la lógica para mostrar los seguimientos
  // Por ejemplo, podrías abrir un diálogo que muestre una tabla con los seguimientos
  // O simplemente desplegar los datos en la consola como se hace aquí
}

const cerrarSeguimiento = () => {
  clienteSeleccionado.value = null;
};

async function activarCliente(clienteData) {
  try {
    await useClientes.toggleEstadoCliente(clienteData._id, true); // Ajustar función para activar cliente
    listarClientes(); // Actualiza la lista de clientes después de cambiar el estado
  } catch (error) {
    console.error(error);
  }
}

async function desactivarCliente(clienteData) {
  try {
    await useClientes.toggleEstadoCliente(clienteData._id, false); // Ajustar función para desactivar cliente
    listarClientes(); // Actualiza la lista de clientes después de cambiar el estado
  } catch (error) {
    console.error(error);
  }
}

async function obtenerPlanes() {
  try {
    const res = await usePlanes.getPlanes();
    planesOptions.value = res.plan.map((plan) => {
      console.log(`Plan ID: ${plan._id}`); // Log para verificar el formato
      return {
        label: plan.descripcion,
        value: plan._id, // Asegúrate de que este es un ObjectId válido
      };
    });
    listarClientes();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerClientePorID(ClieId) {
  try {
    const clientes = await useClientes.getClienteByID(ClieId);
    rows.value = [clientes]; // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

obtenerPlanes();

watch(showForm, (newValue) => {
  if (!newValue) {
    // Limpiar el formulario cuando se cierra el diálogo
    cliente.value = {
      nombre: "",
      fecha_nacimiento: "",
      edad: null,
      fecha_vencimiento: "",
      documento: "",
      direccion: "",
      telefono: "",
      objetivo: "",
      observaciones_limitaciones: "",
      estado: 1,
      id_plan: "",
      foto: "",
    };
    clienteId.value = null;
  }
});

listarClientes(); // Listar clientes al cargar el componente
</script>

<style>
.q-card-section {
  padding: 20px;
}

.q-btn {
  margin-right: 5px;
}

.text-center {
  text-align: center;
}

.seguimiento-table {
  position: relative;
}

.seguimiento-table .close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.q-icon {
  font-size: 3rem;
}
.text-h6 {
  font-size: 1.5rem;
}
</style>

