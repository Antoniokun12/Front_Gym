import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useInventarioStore = defineStore("inventario", () => {

    const inventarios = ref([]);

    let getInventario = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/inventario")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getInventarioActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/inventario/activos")
            inventarios.value = res.data.inventariosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getInventarioInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/inventario/inactivos")
            inventarios.value = res.data.inventariosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }


    let postInventario = async (inventario) => {
        try {
            let req = await axios.post("http://localhost:2500/api/inventario", inventario);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putInventario = async (id, inventario) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/inventario/actualizar/${id}`, inventario);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoInventario = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/inventario/activar/${id}`
                : `http://localhost:2500/api/inventario/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    return {
        getInventario, getInventarioActivos, getInventarioInactivos, postInventario, putInventario, toggleEstadoInventario
    }
},
{
    persist:true,
},
)