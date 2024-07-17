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
      <q-btn-dropdown
        color="primary"
        icon="visibility"
        label="Filtrar"
        style="margin-left: 16px"
      >
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
      <q-select
        v-model="selectedVentaId"
        label="Seleccionar Venta"
        :options="ventaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerVentaPorID"
      />
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
            no-data-label=""
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarVenta(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Editar Venta
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarVenta(props.row)"
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
                  @click="desactivarVenta(props.row)"
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
                <div class="text-h6">No hay ventas disponibles</div>
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
              <q-input
                v-model="cantidad"
                type="number"
                label="Cantidad"
                required
              />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarVenta"
                class="q-mr-sm"
              />
              <q-btn type="submit" label="Guardar" color="primary" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useVentas.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
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
const selectedVentaId = ref("");
const ventaOptions = ref([]);
const productos = ref([]);
const productoMap = ref({});
const valor_unitario = ref("");

const formatFecha = (fechaString) => {
  const fecha = new Date(fechaString);
  const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const opcionesHora = { hour: '2-digit', minute: '2-digit' };
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);
  return `${fechaFormateada} ${horaFormateada}`;
};


const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const productoOptions = ref([]);
const rows = ref([]);
const columns = ref([
  {
    name: "codigo_producto",
    label: "Código Producto",
    align: "center",
    field: "codigo_producto",
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
  {
    name: "valor_unitario",
    label: "Valor Unitario",
    align: "center",
    field: (row) => formatNumber(row.valor_unitario),
  },
  {
    name: "cantidad",
    label: "Cantidad",
    align: "center",
    field: (row) => formatNumber(row.cantidad),
  },
  {
    name: "total",
    label: "Total",
    align: "center",
    field: (row) => formatNumber(row.total),
  },
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
  // Añadir actualización de valor_unitario
  const producto = productoOptions.value.find(prod => prod.value === venta.codigo_producto);
  if (producto) {
    valor_unitario.value = producto.valorUnitario;
  } else {
    valor_unitario.value = 0; // o asignar un valor por defecto
  }
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
    productos.value = Array.isArray(res.inventarios) ? res.inventarios : [];
    
    productoOptions.value = productos.value.map((producto) => {
      return {
        label: producto.codigo + " - " + producto.descripcion,
        value: producto.codigo,
        valorUnitario: producto.valorUnitario,
      };
    });

    productoMap.value = productos.value.reduce((map, producto) => {
      map[producto.codigo] = producto.descripcion;
      return map;
    }, {});

    // Obtener ventas después de obtener productos
    obtenerVentas();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerVentas() {
  try {
    const res = await useVentas.getVentas();
    ventaOptions.value = res.venta.map((venta) => {
      const descripcionProducto = productoMap.value[venta.codigo_producto] || "Descripción no disponible";
      const fechaFormateada = formatFecha(venta.fecha);
      return {
        label: `${descripcionProducto} - ${fechaFormateada} - ${venta.codigo_producto}`,
        value: venta._id,
      };
    });
  } catch (error) {
    console.error(error);
  }
}


async function obtenerVentaPorID(id) {
  try {
    const venta = await useVentas.getMantenimientoByVenta(id);
    rows.value = Array.isArray(venta) ? venta : [venta];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}


watch(selectedVentaId, async (newValue) => {
  if (newValue) {
    await obtenerVentaPorID(newValue);
  }
});

obtenerProductos();
listarVentas();

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
