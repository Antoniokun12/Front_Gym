import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useInventarioStore = defineStore("inventario", () => {

    const inventarios = ref([]);
    let loading = ref(false);

    let getInventario = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/inventario")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getInventarioActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/inventario/activos")
            inventarios.value = res.data.inventariosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getInventarioInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/inventario/inactivos")
            inventarios.value = res.data.inventariosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getInventarioByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`http://localhost:2500/api/inventario/${id}`);
            return res.data.inventario;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }


    let postInventario = async (inventario) => {
        loading.value = true;
        try {
            let req = await axios.post("http://localhost:2500/api/inventario", inventario);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let putInventario = async (id, inventario) => {
        loading.value = true;
        try {
            let req = await axios.put(`http://localhost:2500/api/inventario/actualizar/${id}`, inventario);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let toggleEstadoInventario = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `http://localhost:2500/api/inventario/activar/${id}`
                : `http://localhost:2500/api/inventario/desactivar/${id}`;
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
        getInventario, getInventarioActivos, getInventarioInactivos, getInventarioByID, postInventario, putInventario, toggleEstadoInventario, loading
    }
},
{
    persist:true,
},
)