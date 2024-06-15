<template>
  <div>
    <div class="q-pa-md text-center">
      <div class="text-h2">Sedes</div>
      <q-btn
        label="Agregar Sede"
        color="primary"
        @click="showForm = true"
        class="q-my-md"
      />
      <q-btn-dropdown color="primary" icon="visibility" label="Filtrar" style="margin-left: 16px;">
        <q-list>
          <q-item clickable v-ripple @click="listarSedes">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSedesActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSedesInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedSedeId"
        label="Seleccionar Sede"
        :options="SedeOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px;"
        @update:model-value="obtenerSedePorID"
      />
    </div>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="nombre"
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
                  @click="editarSede(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarSede(props.row)"
                  v-if="props.row.estado === 0"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="desactivarSede(props.row)"
                  v-if="props.row.estado === 1"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.estado === 1 ? 'green' : 'red'"
                  dark
                >
                  {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="q-pa-md text-center">
                <q-icon name="sentiment_dissatisfied" size="lg" class="q-mr-sm" />
                <div class="text-h6">No hay sedes disponibles</div>
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
            <q-form>
              <q-input v-model="nombre" label="Nombre" />
              <q-input v-model="direccion" label="Dirección" />
              <q-input v-model="codigo" label="Código" />
              <q-input v-model="horario" label="Horario" />
              <q-input v-model="ciudad" label="Ciudad" />
              <q-input v-model="telefono" label="Teléfono" />
              <q-btn
                label="Cancelar"
                color="negative"
                @click="cancelarAgregarSede"
                class="q-mr-sm"
              />
              <q-btn
                type="submit"
                label="Guardar"
                color="primary"
                @click="agregarOEditarSede"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSedeStore } from '../stores/sedes.js';

const useSedes = useSedeStore();
const showForm = ref(false);
const nombre = ref('');
const direccion = ref('');
const codigo = ref('');
const horario = ref('');
const ciudad = ref('');
const telefono = ref('');
const sedeId = ref(null); // Para almacenar el ID de la sede en edición
const selectedSedeId = ref("");
const SedeOptions = ref([]);

const rows = ref([]);
const columns = ref([
  { name: 'nombre', label: 'Nombre', align: 'center', field: 'nombre' },
  { name: 'direccion', label: 'Dirección', align: 'center', field: 'direccion' },
  { name: 'codigo', label: 'Código', align: 'center', field: 'codigo' },
  { name: 'horario', label: 'Horario', align: 'center', field: 'horario' },
  { name: 'ciudad', label: 'Ciudad', align: 'center', field: 'ciudad' },
  { name: 'telefono', label: 'Teléfono', align: 'center', field: 'telefono' },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado' },
  { name: 'opciones', label: 'Opciones', align: 'center', field: 'opciones' },
]);

async function listarSedes() {
  try {
    const r = await useSedes.getSedes();
    rows.value = r.sede; // Cambiado para reflejar la estructura correcta de la respuesta
    console.log(r);
    SedeOptions.value = r.sede.map((sede) => ({
      label: sede.nombre,
      value: sede._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarSedesActivos() {
  try {
    const r = await useSedes.getSedesActivos();
    rows.value = r.sedesActivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarSedesInactivos() {
  try {
    const r = await useSedes.getSedesInactivos();
    rows.value = r.sedesInactivos || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarSede() {
  try {
    const data = {
      nombre: nombre.value,
      direccion: direccion.value,
      codigo: codigo.value,
      horario: horario.value,
      ciudad: ciudad.value,
      telefono: telefono.value,
    };
    if (sedeId.value) {
      await useSedes.putSedes(sedeId.value, data);
    } else {
      await useSedes.postSedes(data);
    }
    listarSedes(); // Actualiza la lista de sedes después de agregar o editar
    showForm.value = false;
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarSede() {
  showForm.value = false;
}

function editarSede(sede) {
  // Llenar el formulario con los datos de la sede a editar
  nombre.value = sede.nombre;
  direccion.value = sede.direccion;
  codigo.value = sede.codigo;
  horario.value = sede.horario;
  ciudad.value = sede.ciudad;
  telefono.value = sede.telefono;
  sedeId.value = sede._id; // Almacenar el ID de la sede
  showForm.value = true;
}

async function activarSede(sede) {
  try {
    await useSedes.toggleEstadoSedes(sede._id, true);
    listarSedes(); // Actualiza la lista de sedes después de cambiar el estado
  } catch (error) {
    console.error(error);
  }
}

async function desactivarSede(sede) {
  try {
    await useSedes.toggleEstadoSedes(sede._id, false);
    listarSedes(); // Actualiza la lista de sedes después de cambiar el estado
  } catch (error) {
    console.error(error);
  }
}

async function obtenerSedePorID(SedeId) {
  try {
    const sede = await useSedes.getSedeByID(SedeId);
    rows.value = [sede]; // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

watch(showForm, (newValue) => {
  if (!newValue) {
    // Limpiar el formulario cuando se cierra el diálogo
    nombre.value = '';
    direccion.value = '';
    codigo.value = '';
    horario.value = '';
    ciudad.value = '';
    telefono.value = '';
    sedeId.value = null;
  }
});

listarSedes(); // Listar sedes al cargar el componente

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
