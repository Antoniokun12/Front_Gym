import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useSedeStore = defineStore("sede", () => {

    const sedes = ref([]);

    let getSedes = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/sedes")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getSedesActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/sedes/activos")
            sedes.value = res.data.sedesActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getSedesInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/sedes/inactivos")
            sedes.value = res.data.sedesInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }
    
    let postSedes = async (r) => {
        try {
            let req = await axios.post("http://localhost:2500/api/sedes", r );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putSedes = async (id, data) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/sedes/actualizar/${id}`, data );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoSedes = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/sedes/activar/${id}`
                : `http://localhost:2500/api/sedes/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    return {
        getSedes, getSedesActivos, getSedesInactivos, postSedes, putSedes, toggleEstadoSedes
    }
},
{
    persist:true,
})
