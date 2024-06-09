import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useMaquinaStore = defineStore("maquina", () => {

    const maquinas = ref([]);

    let getMaquina = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/maquinas")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getMaquinasActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/maquinas/activos")
            maquinas.value = res.data.maquinasActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getMaquinasInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/maquinas/inactivos")
            maquinas.value = res.data.maquinasInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }
    
    let postMaquina = async (r) => {
        try {
            let req = await axios.post("http://localhost:2500/api/maquinas", r );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putMaquina = async (id, data) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/maquinas/actualizar/${id}`, data );
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoMaquina = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/maquinas/activar/${id}`
                : `http://localhost:2500/api/maquinas/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }
    return {
        getMaquina, getMaquinasActivos, getMaquinasInactivos, postMaquina, putMaquina, toggleEstadoMaquina
    }
},
{
    persist:true,
})
