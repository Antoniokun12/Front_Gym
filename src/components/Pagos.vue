<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Pagos</div>
      <q-btn
        label="Agregar Pago"
        color="primary"
        @click="showForm = true"
        class="q-my-md"
      />
      <q-btn-dropdown color="primary" icon="visibility" label="Filtrar" style="margin-left: 16px;">
        <q-list>
          <q-item clickable v-ripple @click="listarPagos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarPagosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarPagosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedPagosId"
        label="Seleccionar Pagos por cliente"
        :options="clientesOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px;"
        @update:model-value="obtenerPagosPorID"
      />
    </div>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table
            :rows="enrichedRows"
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
                  @click="editarPago(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarPago(props.row)"
                  v-if="props.row.estado === 0"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="desactivarPago(props.row)"
                  v-else
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
                <q-icon name="sentiment_dissatisfied" size="lg" class="q-mr-sm" />
                <div class="text-h6">No hay pagos disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarPago">
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
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarPago"
                class="q-mr-sm"
              />
              <q-btn
                type="submit"
                label="Guardar"
                color="primary"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch } from "vue";
import { usePagoStore } from "../stores/pagos.js";
import { useClienteStore } from "../stores/clientes.js";

const usePagos = usePagoStore();
const useClientes = useClienteStore();
const showForm = ref(false);
const id_cliente = ref("");
const pagoId = ref(null);
const selectedPagosId = ref("");

const clientesOptions = ref([]);
const rows = ref([]);
const columns = ref([
  { name: "id_cliente", label: "Cliente", align: "center", field: "cliente" },
  { name: "plan", label: "Plan", align: "center", field: "plan" },
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center" },
]);

const enrichedRows = computed(() => {
  return rows.value.map(pago => {
    const cliente = clientesOptions.value.find(c => c.value === pago.id_cliente);
    return {
      ...pago,
      cliente: cliente ? cliente.label : "Desconocido"
    };
  });
});

async function listarPagos() {
  try {
    const r = await usePagos.getPagos();
    rows.value = Array.isArray(r.pago) ? r.pago : [];
  } catch (error) {
    console.error(error);
  }
}

async function listarPagosActivos() {
  try {
    const r = await usePagos.getPagosActivos();
    rows.value = r.pagosActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarPagosInactivos() {
  try {
    const r = await usePagos.getPagosInactivos();
    rows.value = r.pagosInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarClientes() {
  try {
    const r = await useClientes.getClientes();
    clientesOptions.value = r.clientes.map(cliente => ({
      label: cliente.nombre,  
      value: cliente._id
    }));
  } catch (error) {
    console.error(error);
  }
}

async function agregarOEditarPago() {
  try {
    const data = {
      id_cliente: id_cliente.value,
    };
    if (pagoId.value) {
      await usePagos.putPagos(pagoId.value, data);
    } else {
      await usePagos.postPagos(data);
    }
    listarPagos();
    showForm.value = false;
  } catch (error) {
    console.error("Error al agregar o editar pago:", error);
    if (error.response && error.response.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

function cancelarAgregarPago() {
  showForm.value = false;
}

function editarPago(pago) {
  id_cliente.value = pago.id_cliente;
  pagoId.value = pago._id;
  showForm.value = true;
}

async function activarPago(pago) {
  try {
    await usePagos.toggleEstadoPagos(pago._id, true);
    listarPagos();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarPago(pago) {
  try {
    await usePagos.toggleEstadoPagos(pago._id, false);
    listarPagos();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerPagosPorID(Id) {
  try {
    const pagos = await usePagos.getPagosByID(Id);
    rows.value = pagos // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

watch(showForm, (newValue) => {
  if (!newValue) {
    id_cliente.value = "";
    pagoId.value = null;
  }
});

listarClientes();
listarPagos();
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
</style>
