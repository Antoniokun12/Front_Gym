<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Máquinas</div>
      <q-btn
        label="Agregar Máquina"
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
          <q-item clickable v-ripple @click="listarMaquinas">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMaquinasActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMaquinasInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedMaqId"
        label="Seleccionar Maquina"
        :options="MaqOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerMaquinaPorID"
      />
    </div>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table
            :rows="enrichedRows"
            :columns="columns"
            row-key="codigo"
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
                  @click="editarMaquina(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 150px; height: 40px; font-size: 15px"
                  >
                    Editar Maquina
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarMaquina(props.row)"
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
                  @click="desactivarMaquina(props.row)"
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
                <div class="text-h6">No hay maquinas disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarMaquina">
              <h1
                style="
                  font-size: 30px;
                  text-align: center;
                  margin: 0;
                  line-height: 50px;
                "
              >
                Maquina
              </h1>
              <q-input v-model.trim="codigo" label="Código" required />
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
              <q-input
                v-model.trim="descripcion"
                label="Descripción"
                required
              />
              <q-input
                v-model="fecha_ingreso"
                type="date"
                label="Fecha Ingreso"
                required
              />
              <q-input
                v-model="fecha_ultimo_mantenimiento"
                type="date"
                label="Fecha Último Mantenimiento"
                required
              />
              <div style="margin-top: 15px">
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarMaquina"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useMaquinas.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useMaquinaStore } from "../stores/maquinas.js";
import { useSedeStore } from "../stores/sedes.js";

const useMaquinas = useMaquinaStore();
const useSedes = useSedeStore();
const showForm = ref(false);
const codigo = ref("");
const id_sede = ref("");
const descripcion = ref("");
const fecha_ingreso = ref("");
const fecha_ultimo_mantenimiento = ref("");
const estado = ref("");
const maquinaId = ref(null);
const selectedMaqId = ref("");
const MaqOptions = ref([]);

const sedesOptions = ref([]);
const rows = ref([]);
const columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  { name: "sede", label: "Sede", align: "center", field: "sede" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
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
    name: "fecha_ultimo_mantenimiento",
    label: "Fecha Último Mantenimiento",
    align: "center",
    field: "fecha_ultimo_mantenimiento",
    format: (val) => {
      const fecha_ultimo_mantenimiento = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return fecha_ultimo_mantenimiento.toLocaleDateString(
        "es-ES",
        opcionesFecha
      );
    },
  },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const enrichedRows = computed(() => {
  return rows.value.map((maquina) => {
    const sede = sedesOptions.value.find((s) => s.value === maquina.id_sede);
    return {
      ...maquina,
      sede: sede ? sede.label : "Desconocido",
    };
  });
});

async function listarMaquinas() {
  try {
    const r = await useMaquinas.getMaquina();
    rows.value = Array.isArray(r.maquinas) ? r.maquinas : [];
    MaqOptions.value = r.maquinas.map((maquinas) => ({
      label: maquinas.descripcion + " - " + maquinas.codigo,
      value: maquinas._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarMaquinasActivos() {
  try {
    const r = await useMaquinas.getMaquinasActivos();
    rows.value = r.maquinasActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarMaquinasInactivos() {
  try {
    const r = await useMaquinas.getMaquinasInactivos();
    rows.value = r.maquinasInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarMaquina() {
  try {
    // Log para verificar id_sede
    console.log(`ID de Sede seleccionado: ${id_sede.value}`);

    // Validar que id_sede sea un ObjectId válido
    if (!/^[0-9a-fA-F]{24}$/.test(id_sede.value)) {
      throw new Error("ID de Sede inválido");
    }

    const data = {
      codigo: codigo.value,
      id_sede: id_sede.value,
      descripcion: descripcion.value,
      fecha_ingreso: fecha_ingreso.value,
      fecha_ultimo_mantenimiento: fecha_ultimo_mantenimiento.value,
    };
    let result;
    if (maquinaId.value) {
      result = await useMaquinas.putMaquina(maquinaId.value, data);
    } else {
      result = await useMaquinas.postMaquina(data);
    }
    if (result.success) {
      listarMaquinas();
      showForm.value = false;
    }
  } catch (error) {
    console.error("Error al agregar o editar máquina:", error);
    if (error.response && error.response.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

function cancelarAgregarMaquina() {
  showForm.value = false;
}

function editarMaquina(maquina) {
  codigo.value = maquina.codigo;
  id_sede.value = maquina.id_sede;
  descripcion.value = maquina.descripcion;
  fecha_ingreso.value = maquina.fecha_ingreso.split("T")[0];
  fecha_ultimo_mantenimiento.value = maquina.fecha_ultimo_mantenimiento
    ? maquina.fecha_ultimo_mantenimiento.split("T")[0]
    : "";
  estado.value = maquina.estado === 1 ? "Activo" : "Inactivo";
  maquinaId.value = maquina._id;
  showForm.value = true;
}

async function activarMaquina(maquina) {
  try {
    await useMaquinas.toggleEstadoMaquina(maquina._id, true);
    listarMaquinas();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarMaquina(maquina) {
  try {
    await useMaquinas.toggleEstadoMaquina(maquina._id, false);
    listarMaquinas();
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
    listarMaquinas();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerMaquinaPorID(MaqId) {
  try {
    const maquina = await useMaquinas.getMaquinaByID(MaqId);
    rows.value = [maquina]; // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

listarMaquinas();
obtenerSedes();

watch(showForm, (newValue) => {
  if (!newValue) {
    codigo.value = "";
    id_sede.value = "";
    descripcion.value = "";
    fecha_ingreso.value = "";
    fecha_ultimo_mantenimiento.value = "";
    estado.value = "";
    maquinaId.value = null;
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
