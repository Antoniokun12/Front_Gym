import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useSedeStore = defineStore("sede", () => {

    const sedes = ref([]);
    let loading = ref(false);

    let getSedes = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/sedes")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getSedesActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/sedes/activos")
            sedes.value = res.data.sedesActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getSedesInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/sedes/inactivos")
            sedes.value = res.data.sedesInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getSedeByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`http://localhost:2500/api/sedes/${id}`);
            return res.data.sede;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }
    
    let postSedes = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post("http://localhost:2500/api/sedes", r );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let putSedes = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`http://localhost:2500/api/sedes/actualizar/${id}`, data );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let toggleEstadoSedes = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `http://localhost:2500/api/sedes/activar/${id}`
                : `http://localhost:2500/api/sedes/desactivar/${id}`;
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
        getSedes, getSedesActivos, getSedesInactivos, getSedeByID, postSedes, putSedes, toggleEstadoSedes, loading
    }
},
{
    persist:true,
})
