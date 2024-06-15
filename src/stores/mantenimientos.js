import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useMantenimentosStore = defineStore("mantenimientos", () => {

    const mantenimientos = ref([]);

    let getMantenimientos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/mantenimientos")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getMantenimientosActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/mantenimientos/activos")
            mantenimientos.value = res.data.mantenimientosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getMantenimientosInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/mantenimientos/inactivos")
            mantenimientos.value = res.data.mantenimientosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getMantenimientoByMan = async (id) => {
        try {
            let res = await axios.get(`http://localhost:2500/api/mantenimientos/maquina/${id}`);
            return res.data.mantenimiento;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    let postMantenimientos = async (mantenimiento) => {
        try {
            let req = await axios.post("http://localhost:2500/api/mantenimientos", mantenimiento);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putMantenimientos = async (id, mantenimiento) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/mantenimientos/actualizar/${id}`, mantenimiento);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoMantenimientos = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/mantenimientos/activar/${id}`
                : `http://localhost:2500/api/mantenimientos/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    return {
        getMantenimientos, getMantenimientosActivos, getMantenimientosInactivos, getMantenimientoByMan, postMantenimientos, putMantenimientos, toggleEstadoMantenimientos
    }
},
{
    persist:true,
},
)