import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"

export const useIngresoStore = defineStore("ingreso", () => {

    const baseUrl = process.env.VITE_BACKEND_URL;

    const useUsuario = useUsuarioStore();

    const ingresos = ref([]);
    let loading = ref(false);

    let getIngresos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`${baseUrl}/api/ingresos`, {
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

    let getIngresosActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`${baseUrl}/api/ingresos/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            ingresos.value = res.data.ingresosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getIngresosInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`${baseUrl}/api/ingresos/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            ingresos.value = res.data.ingresosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getIngresosByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`${baseUrl}/api/ingresos/ingresos/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.ingresos;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }


    let postIngresos = async (ingreso) => {
        loading.value = true;
        try {
            let req = await axios.post(`${baseUrl}/api/ingresos`, ingreso, {
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

    let putIngresos = async (id, ingreso) => {
        loading.value = true;
        try {
            let req = await axios.put(`${baseUrl}/api/ingresos/actualizar/${id}`, ingreso, {
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

    let toggleEstadoIngresos = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `${baseUrl}/api/ingresos/activar/${id}`
                : `${baseUrl}/api/ingresos/desactivar/${id}`;
            let req = await axios.put(url)
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    return {
        getIngresos, getIngresosActivos, getIngresosInactivos, getIngresosByID, postIngresos, putIngresos, toggleEstadoIngresos, loading
    }
},
{
    persist:true,
},
)
