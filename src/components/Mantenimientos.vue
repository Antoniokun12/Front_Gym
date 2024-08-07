<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Mantenimientos</div>
      <q-btn
        label="Agregar Mantenimiento"
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
          <q-item clickable v-ripple @click="listarMantenimientos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMantenimientosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMantenimientosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedManId"
        label="Seleccionar Mantenimientos por Maquina"
        :options="maquinaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerManPorID"
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
                  @click="editarMantenimiento(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 180px; height: 40px; font-size: 15px"
                  >
                    Editar Mantenimiento
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarMantenimiento(props.row)"
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
                  @click="desactivarMantenimiento(props.row)"
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
                <div class="text-h6">No hay mantenimientos disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarMantenimiento">
              <h1
                style="
                  font-size: 30px;
                  text-align: center;
                  margin: 0;
                  line-height: 50px;
                "
              >
                Mantenimiento
              </h1>
              <q-select
                v-model="id_maquina"
                label="Código Máquina"
                :options="maquinaOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input
                v-model="fecha_mantenimiento"
                type="date"
                label="Fecha de Mantenimiento"
                required
              />
              <q-input
                v-model.trim="descripcion"
                type="text"
                label="Descripción"
                required
              />
              <q-input
                v-model.trim="responsable"
                type="text"
                label="Responsable"
                required
              />
              <q-input
                v-model.trim="precio_mantenimiento"
                type="number"
                label="Precio de Mantenimiento"
                required
              />
              <div style="margin-top: 15px">
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarMantenimiento"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useMantenimientos.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useMantenimentosStore } from "../stores/mantenimientos.js";
import { useMaquinaStore } from "../stores/maquinas.js";

const useMantenimientos = useMantenimentosStore();
const useMaquinas = useMaquinaStore();

const showForm = ref(false);
const id_maquina = ref("");
const fecha_mantenimiento = ref("");
const descripcion = ref("");
const responsable = ref("");
const precio_mantenimiento = ref("");
const mantenimientoId = ref(null);
const selectedManId = ref("");

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const maquinaOptions = ref([]);
const rows = ref([]);
const columns = ref([
  {
    name: "id_maquina",
    label: "Código Máquina",
    align: "center",
    field: (row) => row.id_maquina.codigo,
  },
  {
    name: "fecha_mantenimiento",
    label: "Fecha de Mantenimiento",
    align: "center",
    field: "fecha_mantenimiento",
    format: (val) => {
      const fecha_mantenimiento = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return fecha_mantenimiento.toLocaleDateString("es-ES", opcionesFecha);
    },
  },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  {
    name: "responsable",
    label: "Responsable",
    align: "center",
    field: "responsable",
  },
  {
    name: "precio_mantenimiento",
    label: "Precio de Mantenimiento",
    align: "center",
    field: (row) => formatNumber(row.precio_mantenimiento),
  },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center" },
]);

const enrichedRows = computed(() => {
  return rows.value.map((mantenimiento) => {
    const maquina = maquinaOptions.value.find(
      (m) => m.value === mantenimiento.id_maquina
    );
    return {
      ...mantenimiento,
      id_maquina: maquina ? maquina : { descripcion: "Desconocido" },
    };
  });
});

async function listarMantenimientos() {
  try {
    const r = await useMantenimientos.getMantenimientos();
    rows.value = Array.isArray(r.mantenimiento) ? r.mantenimiento : [];
  } catch (error) {
    console.error(error);
  }
}

async function listarMantenimientosActivos() {
  try {
    const r = await useMantenimientos.getMantenimientosActivos();
    rows.value = r.mantenimientosActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarMantenimientosInactivos() {
  try {
    const r = await useMantenimientos.getMantenimientosInactivos();
    rows.value = r.mantenimientosInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarMantenimiento() {
  try {
    const data = {
      id_maquina: id_maquina.value,
      fecha_mantenimiento: fecha_mantenimiento.value,
      descripcion: descripcion.value,
      responsable: responsable.value,
      precio_mantenimiento: precio_mantenimiento.value,
    };

    let result;

    if (mantenimientoId.value) {
      result = await useMantenimientos.putMantenimientos(
        mantenimientoId.value,
        data
      );
    } else {
      result = await useMantenimientos.postMantenimientos(data);
    }
    if (result.success) {
      listarMantenimientos();
      showForm.value = false;
    }
  } catch (error) {
    console.error("Error al agregar o editar mantenimiento:", error);
    if (error.response && error.response.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

function cancelarAgregarMantenimiento() {
  showForm.value = false;
}

function editarMantenimiento(mantenimiento) {
  id_maquina.value = mantenimiento.id_maquina._id;
  // id_maquina.value = mantenimiento.id_maquina.descripcion;
  fecha_mantenimiento.value = mantenimiento.fecha_mantenimiento.split("T")[0];
  descripcion.value = mantenimiento.descripcion;
  responsable.value = mantenimiento.responsable;
  precio_mantenimiento.value = mantenimiento.precio_mantenimiento;
  mantenimientoId.value = mantenimiento._id;
  showForm.value = true;
}

async function activarMantenimiento(mantenimiento) {
  try {
    await useMantenimientos.toggleEstadoMantenimientos(mantenimiento._id, true);
    listarMantenimientos();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarMantenimiento(mantenimiento) {
  try {
    await useMantenimientos.toggleEstadoMantenimientos(
      mantenimiento._id,
      false
    );
    listarMantenimientos();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerMaquinas() {
  try {
    const res = await useMaquinas.getMaquina();
    maquinaOptions.value = res.maquinas.map((maquina) => {
      return {
        label: maquina.descripcion + " - " + maquina.codigo,
        value: maquina._id,
      };
    });
    listarMantenimientos();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerManPorID(Id) {
  try {
    const mantenimiento = await useMantenimientos.getMantenimientoByMan(Id);
    rows.value = mantenimiento;
  } catch (error) {
    console.error(error);
  }
}

listarMantenimientos();
obtenerMaquinas();

watch(showForm, (newValue) => {
  if (!newValue) {
    id_maquina.value = "";
    fecha_mantenimiento.value = "";
    descripcion.value = "";
    responsable.value = "";
    precio_mantenimiento.value = 0;
    mantenimientoId.value = null;
  }
});
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
</style>
