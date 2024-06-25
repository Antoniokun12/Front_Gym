import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"

export const useInventarioStore = defineStore("inventario", () => {

    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const useUsuario = useUsuarioStore();

    const inventarios = ref([]);
    let loading = ref(false);

    let getInventario = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`${baseUrl}/api/inventario`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let res = await axios.get(`${baseUrl}/api/inventario/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let res = await axios.get(`${baseUrl}/api/inventario/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let res = await axios.get(`${baseUrl}/api/inventario/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let req = await axios.post(`${baseUrl}/api/inventario`, inventario, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let req = await axios.put(`${baseUrl}/api/inventario/actualizar/${id}`, inventario, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
                ? `${baseUrl}/api/inventario/activar/${id}`
                : `${baseUrl}/api/inventario/desactivar/${id}`;
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