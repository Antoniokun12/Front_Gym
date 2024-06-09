import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
// import { useUsuarioStore } from "../stores/usuarios.js"


export const usePlanStore = defineStore("plan", () => {
    const planes = ref([]);

    let getPlanes = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/planes")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getPlanesActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/planes/activos")
            planes.value = res.data.planesActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getPlanesInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/planes/inactivos")
            planes.value = res.data.planesInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getPlanesByID = async (id) => {
        try {
            let res = await axios.get(`http://localhost:2500/api/planes/${id}`);
            return res.data.plan;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    let postPlanes = async (plan) => {
        try {
            let req = await axios.post("http://localhost:2500/api/planes", plan);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putPlanes = async (id, plan) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/planes/actualizar/${id}`, plan);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoPlanes = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/planes/activar/${id}`
                : `http://localhost:2500/api/planes/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    
    return {
        getPlanes, getPlanesActivos, getPlanesInactivos, getPlanesByID, postPlanes, putPlanes, toggleEstadoPlanes
    }
},
    {
        persist: true,
    },
)
