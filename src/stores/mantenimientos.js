import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useMantenimentosStore = defineStore("mantenimientos", () => {

    const mantenimientos = ref([]);
    let loading = ref(false);

    let getMantenimientos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/mantenimientos")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMantenimientosActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/mantenimientos/activos")
            mantenimientos.value = res.data.mantenimientosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMantenimientosInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/mantenimientos/inactivos")
            mantenimientos.value = res.data.mantenimientosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMantenimientoByMan = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`http://localhost:2500/api/mantenimientos/maquina/${id}`);
            return res.data.mantenimiento;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let postMantenimientos = async (mantenimiento) => {
        loading.value = true;
        try {
            let req = await axios.post("http://localhost:2500/api/mantenimientos", mantenimiento);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let putMantenimientos = async (id, mantenimiento) => {
        loading.value = true;
        try {
            let req = await axios.put(`http://localhost:2500/api/mantenimientos/actualizar/${id}`, mantenimiento);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let toggleEstadoMantenimientos = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `http://localhost:2500/api/mantenimientos/activar/${id}`
                : `http://localhost:2500/api/mantenimientos/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    return {
        getMantenimientos, getMantenimientosActivos, getMantenimientosInactivos, getMantenimientoByMan, postMantenimientos, putMantenimientos, toggleEstadoMantenimientos, loading
    }
},
{
    persist:true,
},
)