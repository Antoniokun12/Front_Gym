import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"

export const usePagoStore = defineStore("pago", () => {

    const useUsuario = useUsuarioStore();

    const pagos = ref([]);
    let loading = ref(false);

    let getPagos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/pagos`, {
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

    let getPagosActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/pagos/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            pagos.value = res.data.pagosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getPagosInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/pagos/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            pagos.value = res.data.pagosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getPagosByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/pagos/pagosx/cliente/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.pagos;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let postPagos = async (pago) => {
        loading.value = true;
        try {
            let req = await axios.post(`https://backend-gym-d82g.onrender.com/api/pagos`, pago, {
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

    let putPagos = async (id, pago) => {
        loading.value = true;
        try {
            let req = await axios.put(`https://backend-gym-d82g.onrender.com/api/pagos/actualizar/${id}`, pago, {
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

    let toggleEstadoPagos = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `https://backend-gym-d82g.onrender.com/api/pagos/activar/${id}`
                : `https://backend-gym-d82g.onrender.com/api/pagos/desactivar/${id}`;
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
        getPagos, getPagosActivos, getPagosInactivos, getPagosByID, postPagos, putPagos, toggleEstadoPagos, loading
    }
},
{
    persist:true,
},
)