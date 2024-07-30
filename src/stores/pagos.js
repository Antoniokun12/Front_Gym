import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { Notify } from "quasar";
import { useUsuarioStore } from "../stores/usuarios.js"

export const usePagoStore = defineStore("pago", () => {

    const useUsuario = useUsuarioStore();

    const pagos = ref([]);
    let loading = ref(false);

    let getPagos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/pagos`, {
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
            let res = await axios.get(`api/pagos/activos`, {
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
            let res = await axios.get(`api/pagos/inactivos`, {
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
            let res = await axios.get(`api/pagos/pagosx/cliente/${id}`, {
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

    let getPagosPorFecha = async (fecha) => {
        loading.value = true;
        try {
            let res = await axios.get(`/api/pagos/fecha/${fecha}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
                params: { busqueda: fecha }  // Pasar la fecha como parámetro de consulta
            });
            pagos.value = res.data.pagos || [];
            console.log(res);
            return res.data;
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
            let req = await axios.post(`api/pagos`, pago, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Pago registrado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };

        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al registrar el pago";
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            console.log(error);
            return { success: false };
        } finally {
            loading.value = false;
        }
    }

    let putPagos = async (id, pago) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/pagos/actualizar/${id}`, pago, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Pago Editado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };

        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al registrar el pago";
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            console.log(error);
            return { success: false };
        } finally {
            loading.value = false;
        }
    }

    let toggleEstadoPagos = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/pagos/activar/${id}`
                : `api/pagos/desactivar/${id}`;
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
        getPagos, getPagosActivos, getPagosInactivos, getPagosByID, getPagosPorFecha, postPagos, putPagos, toggleEstadoPagos, loading
    }
},
    {
        persist: true,
    },
)