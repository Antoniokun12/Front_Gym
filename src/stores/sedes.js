import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"

export const useSedeStore = defineStore("sede", () => {

    const baseUrl = process.env.VITE_BACKEND_URL;

    const useUsuario = useUsuarioStore();

    const sedes = ref([]);
    let loading = ref(false);

    let getSedes = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`${baseUrl}/api/sedes`, {
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

    let getSedesActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`${baseUrl}/api/sedes/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let res = await axios.get(`${baseUrl}/api/sedes/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let res = await axios.get(`${baseUrl}/api/sedes/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
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
            let req = await axios.post(`${baseUrl}/api/sedes`, r , {
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

    let putSedes = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`${baseUrl}/api/sedes/actualizar/${id}`, data , {
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

    let toggleEstadoSedes = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `${baseUrl}/api/sedes/activar/${id}`
                : `${baseUrl}/api/sedes/desactivar/${id}`;
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
