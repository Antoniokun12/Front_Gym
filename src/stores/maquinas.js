import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useMaquinaStore = defineStore("maquina", () => {

    const maquinas = ref([]);
    let loading = ref(false);

    let getMaquina = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/maquinas")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMaquinasActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/maquinas/activos")
            maquinas.value = res.data.maquinasActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMaquinasInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/maquinas/inactivos")
            maquinas.value = res.data.maquinasInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMaquinaByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`http://localhost:2500/api/maquinas/${id}`);
            return res.data.maquina;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }
    
    let postMaquina = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post("http://localhost:2500/api/maquinas", r );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let putMaquina = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`http://localhost:2500/api/maquinas/actualizar/${id}`, data );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let toggleEstadoMaquina = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `http://localhost:2500/api/maquinas/activar/${id}`
                : `http://localhost:2500/api/maquinas/desactivar/${id}`;
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
        getMaquina, getMaquinasActivos, getMaquinasInactivos, getMaquinaByID, postMaquina, putMaquina, toggleEstadoMaquina, loading
    }
},
{
    persist:true,
})
