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
      <q-btn-dropdown color="primary" icon="visibility" label="Filtrar" style="margin-left: 16px;">
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
                  @click="editarMaquina(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarMaquina(props.row)"
                  v-if="props.row.estado === 0"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="desactivarMaquina(props.row)"
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
            <q-form @submit.prevent="agregarOEditarMaquina">
              <q-input v-model="codigo" label="Código" required />
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
              <q-input v-model="descripcion" label="Descripción" required />
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
              />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarMaquina"
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

const sedesOptions = ref([]);
const rows = ref([]);
const columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  { name: "id_sede", label: "ID Sede", align: "center", field: "id_sede" },
  { name: "descripcion", label: "Descripción", align: "center", field: "descripcion" },
  { name: "fecha_ingreso", label: "Fecha Ingreso", align: "center", field: "fecha_ingreso" },
  { name: "fecha_ultimo_mantenimiento", label: "Fecha Último Mantenimiento", align: "center", field: "fecha_ultimo_mantenimiento" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

async function listarMaquinas() {
  try {
    const r = await useMaquinas.getMaquina();
    rows.value = Array.isArray(r.maquinas) ? r.maquinas : [];
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
    if (maquinaId.value) {
      await useMaquinas.putMaquina(maquinaId.value, data);
    } else {
      await useMaquinas.postMaquina(data);
    }
    listarMaquinas();
    showForm.value = false;
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
  fecha_ultimo_mantenimiento.value = maquina.fecha_ultimo_mantenimiento ? maquina.fecha_ultimo_mantenimiento.split("T")[0] : "";
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
</style>
