<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Inventario</div>
      <q-btn
        label="Agregar Inventario"
        color="primary"
        @click="showForm = true"
        class="q-my-md"
      />
      <q-btn-dropdown color="primary" icon="visibility" label="Filtrar" style="margin-left: 16px;">
        <q-list>
          <q-item clickable v-ripple @click="listarInventario">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarInventarioActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarInventarioInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedInvId"
        label="Seleccionar codigo producto"
        :options="InvOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px;"
        @update:model-value="obtenerInvPorID"
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
                  @click="editarInventario(props.row)"
                >
                <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Editar Articulo
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarInventario(props.row)"
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
                  @click="desactivarInventario(props.row)"
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
                <q-icon name="sentiment_dissatisfied" size="lg" class="q-mr-sm" />
                <div class="text-h6">No hay productos disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarInventario">
              <q-input v-model="codigo" label="Código" required />
              <q-input v-model="descripcion" label="Descripción" required />
              <q-input v-model="valorUnitario" type="number" label="Valor Unitario" required />
              <q-input v-model="cantidad" type="number" label="Cantidad" required />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarInventario"
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
      <div v-if="useInventario.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useInventarioStore } from "../stores/inventario.js";

const useInventario = useInventarioStore();
const showForm = ref(false);
const codigo = ref("");
const descripcion = ref("");
const valorUnitario = ref(0);
const cantidad = ref(0);
const inventarioId = ref(null);
const selectedInvId = ref("");
const InvOptions = ref([]);

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const rows = ref([]);
const columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  { name: "descripcion", label: "Descripción", align: "center", field: "descripcion" },
  { name: "valorUnitario", label: "Valor Unitario", align: "center", field: (row)=>formatNumber(row.valorUnitario) },
  { name: "cantidad", label: "Cantidad", align: "center", field: (row)=>formatNumber(row.cantidad) },
  { name: "valorTotal", label: "Valor Total", align: "center", field: (row)=>formatNumber(row.valorTotal) },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center" },
]);

async function listarInventario() {
  try {
    const r = await useInventario.getInventario();
    rows.value = Array.isArray(r.inventarios) ? r.inventarios : [];
    InvOptions.value = r.inventarios.map((inventarios) => ({
      label: inventarios.descripcion + ' - ' + inventarios.codigo,
      value: inventarios._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarInventarioActivos() {
  try {
    const r = await useInventario.getInventarioActivos();
    rows.value = r.inventariosActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarInventarioInactivos() {
  try {
    const r = await useInventario.getInventarioInactivos();
    rows.value = r.inventariosInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarInventario() {
  try {
    const data = {
      codigo: codigo.value,
      descripcion: descripcion.value,
      valorUnitario: valorUnitario.value,
      cantidad: cantidad.value,
    };
    if (inventarioId.value) {
      await useInventario.putInventario(inventarioId.value, data);
    } else {
      await useInventario.postInventario(data);
    }
    listarInventario();
    showForm.value = false;
  } catch (error) {
    console.error("Error al agregar o editar inventario:", error);
    if (error.response && error.response.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

function cancelarAgregarInventario() {
  showForm.value = false;
}

function editarInventario(inventario) {
  codigo.value = inventario.codigo;
  descripcion.value = inventario.descripcion;
  valorUnitario.value = inventario.valorUnitario;
  cantidad.value = inventario.cantidad;
  inventarioId.value = inventario._id;
  showForm.value = true;
}

async function activarInventario(inventario) {
  try {
    await useInventario.toggleEstadoInventario(inventario._id, true);
    listarInventario();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarInventario(inventario) {
  try {
    await useInventario.toggleEstadoInventario(inventario._id, false);
    listarInventario();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerInvPorID(InvId) {
  try {
    const inventario = await useInventario.getInventarioByID(InvId);
    rows.value = [inventario]; // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

watch(showForm, (newValue) => {
  if (!newValue) {
    codigo.value = "";
    descripcion.value = "";
    valorUnitario.value = 0;
    cantidad.value = 0;
    inventarioId.value = null;
  }
});

listarInventario();
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
