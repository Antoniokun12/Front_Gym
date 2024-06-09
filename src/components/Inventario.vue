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
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarInventario(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarInventario(props.row)"
                  v-if="props.row.estado === 0"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="desactivarInventario(props.row)"
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

const rows = ref([]);
const columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  { name: "descripcion", label: "Descripción", align: "center", field: "descripcion" },
  { name: "valorUnitario", label: "Valor Unitario", align: "center", field: "valorUnitario" },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  { name: "valorTotal", label: "Valor Total", align: "center", field: "valorTotal" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center" },
]);

async function listarInventario() {
  try {
    const r = await useInventario.getInventario();
    rows.value = Array.isArray(r.inventarios) ? r.inventarios : [];
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
</style>
