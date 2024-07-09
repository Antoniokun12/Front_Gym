<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Planes</div>
      <q-btn
        label="Agregar Plan"
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
          <q-item clickable v-ripple @click="listarPlanes">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarPlanesActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarPlanesInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedPlanId"
        label="Seleccionar Plan"
        :options="planOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerPlanPorID"
      />
    </div>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table
            :rows="rows"
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
                  @click="editarPlan(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Editar Plan
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarPlan(props.row)"
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
                  @click="desactivarPlan(props.row)"
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
                <div class="text-h6">No hay planes disponibles</div>
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
            <q-form @submit="agregarOEditarPlan">
              <q-input v-model="plan.codigo" label="Código" required />
              <q-input
                v-model="plan.descripcion"
                label="Descripción"
                required
              />
              <q-input
                v-model="plan.valor"
                label="Valor"
                type="number"
                required
              />
              <q-input
                v-model="plan.dias"
                label="Días"
                type="number"
                required
              />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarPlan"
                class="q-mr-sm"
              />
              <q-btn type="submit" label="Guardar" color="primary" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="planStore.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { usePlanStore } from "../stores/planes.js";

const planStore = usePlanStore();
const showForm = ref(false);
const planes = "";
const codigo = "";
const descripcion = "";
const valor = "";
const dias = "";

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const planId = ref(null);
const rows = ref([]);
const selectedPlanId = ref("");
const plan = ref({
  codigo: "",
  descripcion: "",
  valor: "",
  dias: "",
});
const columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  { name: "valor", label: "Valor", align: "center", field: (row)=>formatNumber(row.valor) },
  { name: "dias", label: "Días", align: "center", field: "dias" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const planOptions = ref([]);

async function listarPlanes() {
  try {
    const r = await planStore.getPlanes();
    rows.value = r.plan || [];
    planOptions.value = r.plan.map((plan) => ({
      label: plan.descripcion + " - " + plan.codigo,
      value: plan._id,
    }));
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarPlanesActivos() {
  try {
    const r = await planStore.getPlanesActivos();
    rows.value = r.planesActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarPlanesInactivos() {
  try {
    const r = await planStore.getPlanesInactivos();
    rows.value = r.planesInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarPlan() {
  try {
    if (planId.value) {
      await planStore.putPlanes(planId.value, plan.value);
    } else {
      await planStore.postPlanes(plan.value);
    }
    listarPlanes();
    showForm.value = false;
  } catch (error) {
  } 
}

function cancelarAgregarPlan() {
  showForm.value = false;
}

function editarPlan(planData) {
  plan.value = { ...planData };
  planId.value = planData._id;
  showForm.value = true;
}

async function activarPlan(planData) {
  try {
    await planStore.toggleEstadoPlanes(planData._id, true);
    listarPlanes();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarPlan(planData) {
  try {
    await planStore.toggleEstadoPlanes(planData._id, false);
    listarPlanes();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerPlanPorID(userId) {
  try {
    const plan = await planStore.getPlanesByID(userId);
    rows.value = [plan]; // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

watch(showForm, (newValue) => {
  if (!newValue) {
    plan.value = {
      codigo: "",
      descripcion: "",
      valor: null,
      dias: null,
      estado: 1,
    };
    planId.value = null;
  }
});

listarPlanes();
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

