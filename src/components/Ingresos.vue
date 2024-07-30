<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Ingresos</div>
      <q-btn
        label="Agregar Ingreso"
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
          <q-item clickable v-ripple @click="listarIngresos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarIngresosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarIngresosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedIngresosId"
        label="Seleccionar Cliente"
        :options="clientesOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerIngresosPorID"
      />
      <div class="fes">
        <q-input
          v-model="fechaFiltro"
          type="date"
          label="Filtrar por Fecha"
          class="q-mb-md"
          style="max-width: 200px; margin-left: 16px"
        />
        <q-btn
          label="Filtrar"
          color="primary"
          @click="filtrarPorFecha"
          class="fes"
        />
      </div>
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
                  @click="editarIngreso(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Editar Ingreso
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarIngreso(props.row)"
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
                  @click="desactivarIngreso(props.row)"
                  v-else
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
                <div class="text-h6">No hay ingresos disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarIngreso">
              <h1
                style="
                  font-size: 30px;
                  text-align: center;
                  margin: 0;
                  line-height: 50px;
                "
              >
                Ingreso
              </h1>
              <q-select
                v-model="id_cliente"
                label="Cliente"
                :options="clientesOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-select
                v-model="id_sede"
                label="Sede"
                :options="sedesOptions"
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
                  @click="cancelarAgregarIngreso"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useIngresos.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useIngresoStore } from "../stores/ingresos.js";
import { useClienteStore } from "../stores/clientes.js";
import { useSedeStore } from "../stores/sedes.js";

const useIngresos = useIngresoStore();
const useClientes = useClienteStore();
const useSedes = useSedeStore();
const showForm = ref(false);
const id_cliente = ref("");
const id_sede = ref("");
const fecha = ref("");
const estado = ref("");
const ingresoId = ref(null);
const selectedIngresosId = ref("");

const fechaFiltro = ref("");

const clientesOptions = ref([]);
const sedesOptions = ref([]);
const clientesMap = ref({});
const sedesMap = ref({});
const rows = ref([]);
const columns = ref([
  {
    name: "cliente",
    label: "Cliente",
    align: "center",
    field: (row) => (row.id_cliente ? row.id_cliente.nombre : ""),
  },
  {
    name: "sede",
    label: "Sede",
    align: "center",
    field: (row) => row.id_sede.nombre,
  },
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
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const enrichedRows = computed(() => {
  return rows.value.map((ingreso) => {
    const cliente = clientesMap.value[ingreso.id_cliente];
    const sede = sedesMap.value[ingreso.id_sede];
    return {
      ...ingreso,
      cliente: cliente ? cliente : "Desconocido",
      sede: sede ? sede : "Desconocido",
    };
  });
});

async function listarIngresos() {
  try {
    const r = await useIngresos.getIngresos();
    rows.value = r.ingresos;
  } catch (error) {
    console.error(error);
  }
}

async function listarIngresosActivos() {
  try {
    const r = await useIngresos.getIngresosActivos();
    rows.value = r.ingresosActivos;
  } catch (error) {
    console.error(error);
  }
}

async function listarIngresosInactivos() {
  try {
    const r = await useIngresos.getIngresosInactivos();
    rows.value = r.ingresosInactivos;
  } catch (error) {
    console.error(error);
  }
}

async function filtrarPorFecha() {
  try {
    if (fechaFiltro.value) {
      
      const r = await useIngresos.getIngresosPorFecha(fechaFiltro.value);
      rows.value = r.ingresos || [];
    } else {
      listarIngresos(); 
    }
  } catch (error) {
    console.error(error);
  }
}

async function agregarOEditarIngreso() {
  try {
    console.log(`ID de Cliente seleccionado: ${id_cliente.value}`);
    console.log(`ID de Sede seleccionado: ${id_sede.value}`);

    if (!/^[0-9a-fA-F]{24}$/.test(id_cliente.value)) {
      throw new Error("ID de Cliente inválido");
    }
    if (!/^[0-9a-fA-F]{24}$/.test(id_sede.value)) {
      throw new Error("ID de Sede inválido");
    }

    const data = {
      id_cliente: id_cliente.value,
      id_sede: id_sede.value,
    };
    if (ingresoId.value) {
      await useIngresos.putIngresos(ingresoId.value, data);
    } else {
      await useIngresos.postIngresos(data);
    }
    listarIngresos();
    showForm.value = false;
  } catch (error) {
    console.error("Error al agregar o editar ingreso:", error);
    if (error.response && error.response.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

function cancelarAgregarIngreso() {
  showForm.value = false;
}

function editarIngreso(ingreso) {
  id_cliente.value = ingreso.id_cliente._id;
  id_sede.value = ingreso.id_sede._id;
  fecha.value = ingreso.fecha.split("T")[0];
  estado.value = ingreso.estado === 1 ? "Activo" : "Inactivo";
  ingresoId.value = ingreso._id;
  showForm.value = true;
}

async function activarIngreso(ingreso) {
  try {
    await useIngresos.toggleEstadoIngresos(ingreso._id, true);
    listarIngresos();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarIngreso(ingreso) {
  try {
    await useIngresos.toggleEstadoIngresos(ingreso._id, false);
    listarIngresos();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerClientesYSedes() {
  try {
    const resClientes = await useClientes.getClientes();
    clientesOptions.value = resClientes.clientes.map((cliente) => ({
      label: cliente.nombre + " - " + cliente.documento,
      value: cliente._id,
    }));
    clientesMap.value = resClientes.clientes.reduce((acc, cliente) => {
      acc[cliente._id] = cliente.nombre;
      return acc;
    }, {});

    const resSedes = await useSedes.getSedes();
    sedesOptions.value = resSedes.sede.map((sede) => ({
      label: sede.nombre,
      value: sede._id,
    }));
    sedesMap.value = resSedes.sede.reduce((acc, sede) => {
      acc[sede._id] = sede.nombre;
      return acc;
    }, {});

    // listarIngresos();
  } catch (error) {
    console.error(error);
  }
}

obtenerClientesYSedes();

async function obtenerIngresosPorID(Id) {
  try {
    const ingresos = await useIngresos.getIngresosByID(Id);
    rows.value = ingresos;
  } catch (error) {
    console.error(error);
  }
}

watch(showForm, (newValue) => {
  if (!newValue) {
    id_cliente.value = "";
    id_sede.value = "";
    fecha.value = "";
    estado.value = "";
    ingresoId.value = null;
  }
});
listarIngresos();
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

.fes{
  width: 200px;
}
</style>

