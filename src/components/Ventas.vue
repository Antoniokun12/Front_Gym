<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Ventas</div>
      <q-btn
        label="Agregar Venta"
        color="primary"
        @click="showForm = true"
        class="q-my-md"
      />
      <q-btn-dropdown color="primary" icon="visibility" label="Filtrar" style="margin-left: 16px;">
        <q-list>
          <q-item clickable v-ripple @click="listarVentas">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarVentasActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarVentasInactivos">
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
            row-key="codigo_producto"
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
                  @click="editarVenta(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarVenta(props.row)"
                  v-if="props.row.estado === 0"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="desactivarVenta(props.row)"
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
            <q-form @submit.prevent="agregarOEditarVenta">
              <q-select
                v-model="codigo_producto"
                label="Código Producto"
                :options="productoOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input v-model="cantidad" type="number" label="Cantidad" required />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarVenta"
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
import { useVentaStore } from "../stores/ventas.js";
import { useInventarioStore } from "../stores/inventario.js";

const useVentas = useVentaStore();
const useInventario = useInventarioStore();
const showForm = ref(false);
const codigo_producto = ref("");
const cantidad = ref(0);
const ventaId = ref(null);

const productoOptions = ref([]);
const rows = ref([]);
const columns = ref([
  { name: "codigo_producto", label: "Código Producto", align: "center", field: "codigo_producto" },
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  { name: "valor_unitario", label: "Valor Unitario", align: "center", field: "valor_unitario" },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  { name: "total", label: "Total", align: "center", field: "total" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center" },
]);

async function listarVentas() {
  try {
    const r = await useVentas.getVentas();
    rows.value = Array.isArray(r.venta) ? r.venta : [];
  } catch (error) {
    console.error(error);
  }
}

async function listarVentasActivos() {
  try {
    const r = await useVentas.getVentasActivos();
    rows.value = r.ventasActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarVentasInactivos() {
  try {
    const r = await useVentas.getVentasInactivos();
    rows.value = r.ventasInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarVenta() {
  try {
    const producto = productoOptions.value.find(prod => prod.value === codigo_producto.value);
    const valor_unitario = producto ? producto.valorUnitario : 0;
    const total = valor_unitario * cantidad.value;

    const data = {
      codigo_producto: codigo_producto.value,
      valor_unitario: valor_unitario,
      cantidad: cantidad.value,
      total: total,
    };

    if (ventaId.value) {
      await useVentas.putVentas(ventaId.value, data);
    } else {
      await useVentas.postVentas(data);
    }
    listarVentas();
    showForm.value = false;
  } catch (error) {
    console.error("Error al agregar o editar venta:", error);
    if (error.response && error.response.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

function cancelarAgregarVenta() {
  showForm.value = false;
}

function editarVenta(venta) {
  codigo_producto.value = venta.codigo_producto;
  cantidad.value = venta.cantidad;
  ventaId.value = venta._id;
  showForm.value = true;
}

async function activarVenta(venta) {
  try {
    await useVentas.toggleEstadoVentas(venta._id, true);
    listarVentas();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarVenta(venta) {
  try {
    await useVentas.toggleEstadoVentas(venta._id, false);
    listarVentas();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerProductos() {
  try {
    const res = await useInventario.getInventario();
    productoOptions.value = res.inventarios.map((producto) => {
      return {
        label: producto.codigo,
        value: producto.codigo,
        valorUnitario: producto.valorUnitario,
      };
    });
    listarVentas();
  } catch (error) {
    console.error(error);
  }
}
obtenerProductos();

watch(showForm, (newValue) => {
  if (!newValue) {
    codigo_producto.value = "";
    cantidad.value = 0;
    ventaId.value = null;
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
</style>
