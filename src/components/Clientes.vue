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
    <div v-if="!mostrarSeguimientos" class="q-pa-md">
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
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Editar Cliente
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarCliente(props.row)"
                  v-if="props.row.estado === 0"
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
                  @click="desactivarCliente(props.row)"
                  v-if="props.row.estado === 1"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Desactivar
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="add"
                  @click="prepararAgregarSeguimiento(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 170px; height: 40px; font-size: 15px"
                  >
                    Add seguimiento
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="remove_red_eye"
                  @click="verSeguimientos(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 170px; height: 40px; font-size: 15px"
                  >
                    Ver seguimientos
                  </q-tooltip>
                </q-btn>
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
    <div v-if="mostrarSeguimientos" class="q-pa-md seguimiento-table">
      <q-card>
        <q-card-section>
          <div class="q-pa-md text-center cliente-header">
            <div class="text-h3 cliente-info">
              <img
                :src="clienteSeleccionado.foto"
                alt="Foto Cliente"
                class="cliente-foto"
              />
              Seguimientos de {{ clienteSeleccionado.nombre }}
            </div>
            <!-- Otros elementos del encabezado -->
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
          >
            <template v-slot:body-cell-imc="props">
              <q-td :props="props" :style="getIMCCellStyle(props.row.imc)">
                {{ props.row.imc.toFixed(1) }} -
                {{ obtenerEstadoIMC(props.row.imc).estado }}
              </q-td>
            </template>
            <template v-slot:body-cell-editar="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarSeguimiento(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 150px; height: 40px; font-size: 15px"
                  >
                    Editar Seguimiento
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="showEditarSeguimientoForm">
      <q-card>
        <q-card-section>
          <q-form @submit="guardarSeguimientoEditado">
            <q-input
              v-model="seguimientoEditado.fecha"
              label="Fecha"
              type="date"
              required
            />
            <q-input
              v-model="seguimientoEditado.peso"
              label="Peso"
              type="number"
              required
            />
            <q-input
              v-model="seguimientoEditado.altura"
              label="Altura"
              type="number"
              required
            />
            <q-input
              v-model="seguimientoEditado.medida_brazo"
              label="Medida del Brazo"
              type="number"
              required
            />
            <q-input
              v-model="seguimientoEditado.medida_pierna"
              label="Medida de la Pierna"
              type="number"
              required
            />
            <q-input
              v-model="seguimientoEditado.medida_cintura"
              label="Medida de la Cintura"
              type="number"
              required
            />

            <q-btn
              label="Cancelar"
              color="negative"
              @click="cancelarEdicionSeguimiento"
              class="q-mr-sm"
            />
            <q-btn type="submit" label="Guardar" color="primary" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card>
          <q-card-section>
            <q-form @submit="agregarOEditarCliente">
              <h1
                style="
                  font-size: 30px;
                  text-align: center;
                  margin: 0;
                  line-height: 50px;
                "
              >
                Cliente
              </h1>
              <q-input
                v-model.trim="cliente.nombre"
                label="Nombre Cliente"
                required
              />
              <q-input
                v-model.trim="cliente.fecha_nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                required
              />
              <q-input v-model.trim="cliente.foto" label="Url de la foto" required />
              <q-input v-model.trim="cliente.documento" label="Documento" required />
              <q-input v-model.trim="cliente.direccion" label="Dirección" required />
              <q-input v-model.trim="cliente.telefono" label="Teléfono" required />
              <q-input
                v-model.trim="cliente.objetivo"
                label="Objetivo"
                type="textarea"
                required
              />
              <q-input
                v-model.trim="cliente.observaciones_limitaciones"
                label="Observaciones/Limitaciones"
                type="textarea"
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
              <div style="margin-top: 15px">
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarCliente"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Nuevo formulario de seguimiento -->
      <q-dialog v-model="showSeguimientoForm">
        <q-card>
          <q-card-section>
            <q-form @submit="agregarSeguimiento">
              <h1
                style="
                  font-size: 30px;
                  text-align: center;
                  margin: 0;
                  line-height: 50px;
                "
              >
                Seguimiento
              </h1>
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
      <div v-if="useClientes.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
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
const showSeguimientoForm = ref(false);
const mostrarSeguimientos = ref(false);

const planesOptions = ref([]);
const selectedClieId = ref("");

const edad = ref("");

const seguimientoEditado = ref({
  fecha: "",
  peso: null,
  altura: null,
  imc: null,
  medida_brazo: null,
  medida_pierna: null,
  medida_cintura: null,
});

const fecha = ref("");

const cliente = ref({
  nombre: "",
  fecha_nacimiento: "",
  foto: "",
  documento: "",
  direccion: "",
  telefono: "",
  objetivo: "",
  observaciones_limitaciones: "",
  id_plan: "",
  seguimiento: [],
});
const seguimiento = ref({
  fecha: "",
  peso: "",
  altura: "",
  imc: "",
  medida_brazo: "",
  medida_pierna: "",
  medida_cintura: "",
});
const clienteId = ref(null);

const clienteSeleccionado = ref(null);
const showEditarSeguimientoForm = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre Cliente", align: "center", field: "nombre" },
  {
    name: "fecha_nacimiento",
    label: "Fecha Nacimiento",
    align: "center",
    field: "fecha_nacimiento",
    format: (val) => {
      const fecha_nacimiento = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return fecha_nacimiento.toLocaleDateString("es-ES", opcionesFecha);
    },
  },
  { name: "edad", label: "Edad", align: "center", field: "edad" },
  {
    name: "fecha_ingreso",
    label: "Fecha Ingreso",
    align: "center",
    field: "fecha_ingreso",
    format: (val) => {
      const fecha_ingreso = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return fecha_ingreso.toLocaleDateString("es-ES", opcionesFecha);
    },
  },
  {
    name: "fecha_vencimiento",
    label: "Fecha Vencimiento",
    align: "center",
    field: "fecha_vencimiento",
    format: (val) => {
      const fecha_vencimiento = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      // Formatear solo la fecha, sin la hora
      const fechaFormateada = fecha_vencimiento.toLocaleDateString(
        "es-ES",
        opcionesFecha
      );
      return fechaFormateada;
    },
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

function obtenerEstadoIMC(imc) {
  if (imc < 18.5) {
    return { estado: "Bajo Peso", color: "#00BFFF" }; // Azul
  } else if (imc >= 18.5 && imc < 24.9) {
    return { estado: "Normal", color: "#00FF00" }; // Verde
  } else if (imc >= 25 && imc < 29.9) {
    return { estado: "Sobrepeso", color: "#FFFF00" }; // Amarillo
  } else if (imc >= 30 && imc < 34.9) {
    return { estado: "Obesidad I", color: "#FFA500" }; // Naranja
  } else if (imc >= 35 && imc < 39.9) {
    return { estado: "Obesidad II", color: "#FF4500" }; // Naranja oscuro
  } else {
    return { estado: "Obesidad III", color: "#FF0000" }; // Rojo
  }
}

function getIMCCellStyle(imc) {
  const { color } = obtenerEstadoIMC(imc);
  return {
    backgroundColor: color,
    color: "#000000",
    padding: "10px",
  };
}

const seguimientoColumns = ref([
  {
    name: "fecha",
    label: "Fecha",
    align: "center",
    field: "fecha",
    format: (val) => {
      const fecha = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const opcionesHora = { hour: "2-digit", minute: "2-digit" };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);
      const horaFormateada = fecha.toLocaleTimeString("es-ES", opcionesHora);
      return `${fechaFormateada} ${horaFormateada}`;
    },
  },
  { name: "peso", label: "Peso", align: "center", field: "peso" },
  { name: "altura", label: "Altura", align: "center", field: "altura" },
  {
    name: "imc",
    label: "IMC",
    align: "center",
    field: "imc",
    format: (val) => {
      const { estado } = obtenerEstadoIMC(val);
      return `${val.toFixed(1)} - ${estado}`;
    },
    style: (row) => {
      const { color } = obtenerEstadoIMC(row.imc);
      return `background-color: ${color}; color: #ffffff;`;
    },
  },
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
  { name: "editar", label: "Editar", align: "center", field: "editar" },
]);

const ClieOptions = ref([]);

async function listarClientes() {
  try {
    const r = await useClientes.getClientes();
    rows.value = r.clientes;
    ClieOptions.value = r.clientes.map((cliente) => ({
      label: cliente.nombre + " - " + cliente.documento,
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
    let result;
    if (clienteId.value) {
      result = await useClientes.putCliente(clienteId.value, cliente.value);
    } else {
      result = await useClientes.postCliente(cliente.value);
    }
    if (result.success) {
      listarClientes();
      showForm.value = false;
    }
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
    listarClientes();
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
  cliente.value = { ...clienteData };
  clienteId.value = clienteData._id;

  cliente.value.fecha_nacimiento = new Date(clienteData.fecha_nacimiento)
    .toISOString()
    .split("T")[0];

  // Asegúrate de que clienteData.id_plan sea un valor primitivo (string o number)
  const idPlan =
    typeof clienteData.id_plan === "object"
      ? clienteData.id_plan._id
      : clienteData.id_plan;

  // Busca el plan correspondiente en planesOptions
  const planSeleccionado = planesOptions.value.find(
    (plan) => plan.value === idPlan
  );

  // Si el plan fue encontrado, asigna el plan al cliente
  if (planSeleccionado) {
    cliente.value.id_plan = planSeleccionado.value;
  } else {
    // Si no se encuentra el plan, puedes manejar el error aquí
    console.warn(`Plan con id ${idPlan} no encontrado`);
  }

  // Muestra el formulario de edición
  showForm.value = true;
}

function verSeguimientos(clienteData) {
  mostrarSeguimientos.value = true;
  clienteSeleccionado.value = clienteData;
  console.log("Seguimientos del cliente:", clienteData.seguimiento);
}

const cerrarSeguimiento = () => {
  mostrarSeguimientos.value = false;
  clienteSeleccionado.value = null;
};

async function activarCliente(clienteData) {
  try {
    await useClientes.toggleEstadoCliente(clienteData._id, true);
    listarClientes();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarCliente(clienteData) {
  try {
    await useClientes.toggleEstadoCliente(clienteData._id, false);
    listarClientes();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerPlanes() {
  try {
    const res = await usePlanes.getPlanes();
    planesOptions.value = res.plan.map((plan) => ({
      label: plan.descripcion,
      value: plan._id,
    }));
    listarClientes();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerClientePorID(ClieId) {
  try {
    const clientes = await useClientes.getClienteByID(ClieId);
    rows.value = [clientes];
  } catch (error) {
    console.error(error);
  }
}

const cancelarEdicionSeguimiento = () => {
  seguimientoEditado.value = null;
  showEditarSeguimientoForm.value = false;
};

const editarSeguimiento = (seguimiento) => {
  if (!seguimiento || !seguimiento._id) {
    console.error("Seguimiento no definido o sin ID");
    return;
  }

  // Asignar el seguimiento a editar
  seguimientoEditado.value = {
    ...seguimiento,
    fecha: seguimiento.fecha
      ? new Date(seguimiento.fecha).toISOString().substring(0, 10)
      : "",
    _id: seguimiento._id, // Asegurarse de que se utilice el _id del seguimiento
  };

  console.log("Seguimiento a editar:", seguimientoEditado.value);
  showEditarSeguimientoForm.value = true;
};

const guardarSeguimientoEditado = async () => {
  try {
    // Verificar que el cliente seleccionado y el seguimiento editado tienen IDs definidos
    if (!clienteSeleccionado.value || !clienteSeleccionado.value._id) {
      throw new Error("ID de cliente no definido");
    }

    if (!seguimientoEditado.value || !seguimientoEditado.value._id) {
      throw new Error("ID de seguimiento no definido");
    }

    // Mostrar en consola el seguimiento a editar antes de la solicitud HTTP
    console.log("Seguimiento a editar:", seguimientoEditado.value);

    // Preparar el objeto de datos para enviar al backend
    const datosActualizados = {
      idSeguimiento: seguimientoEditado.value._id,
      updateSeguimiento: {
        fecha: seguimientoEditado.value.fecha,
        peso: parseFloat(seguimientoEditado.value.peso),
        altura: parseFloat(seguimientoEditado.value.altura),
        imc: parseFloat(seguimientoEditado.value.imc),
        medida_brazo: parseFloat(seguimientoEditado.value.medida_brazo),
        medida_pierna: parseFloat(seguimientoEditado.value.medida_pierna),
        medida_cintura: parseFloat(seguimientoEditado.value.medida_cintura),
      },
    };

    await useClientes.editarSeguimiento(
      clienteSeleccionado.value._id,
      datosActualizados
    );

    const index = clienteSeleccionado.value.seguimiento.findIndex(
      (s) => s._id === seguimientoEditado.value._id
    );
    if (index !== -1) {
      clienteSeleccionado.value.seguimiento[index] = {
        ...clienteSeleccionado.value.seguimiento[index],
        ...datosActualizados.updateSeguimiento,
      };
    }

    showEditarSeguimientoForm.value = false;
    seguimientoEditado.value = null;

    clienteSeleccionado.value = { ...clienteSeleccionado.value };
  } catch (error) {
    console.error("Error al guardar seguimiento editado:", error);
  }
};

obtenerPlanes();

watch(showForm, (newValue) => {
  if (!newValue) {
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

listarClientes();
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

.cliente-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* Ajusta la altura según tus necesidades */
}

.cliente-info {
  display: flex;
  align-items: center;
}

.cliente-foto {
  width: 150px; /* Ajusta el tamaño de la imagen según tus necesidades */
  height: 150px;
  border-radius: 50%; /* Para hacer la imagen redonda */
  margin-right: 10px; /* Espacio entre la imagen y el texto */
}
</style>

