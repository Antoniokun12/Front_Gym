import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { Notify } from "quasar";
import { useUsuarioStore } from "../stores/usuarios.js"

export const useVentaStore = defineStore("venta", () => {

    const useUsuario = useUsuarioStore();

    const ventas = ref([]);
    let loading = ref(false);

    let getVentas = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/ventas`, {
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

    let getVentasActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/ventas/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            ventas.value = res.data.ventasActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getVentasInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/ventas/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            ventas.value = res.data.ventasInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMantenimientoByVenta = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/ventas/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.venta;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    const getVentasPorFecha = async (fecha) => {
        loading.value = true;
        try {
            const res = await axios.get(`api/ventas/fecha/${fecha}`, {
                headers: { "x-token": useUsuario.token },
            });
            return res.data; // Asegúrate de que `res.data` contiene `ventas`
        } catch (error) {
            console.error('Error en getVentasPorFecha:', error);
            return error;
        } finally {
            loading.value = false;
        }
    }


    let postVentas = async (venta) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/ventas`, venta, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Venta registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };

        } catch (error) {
            let errorMessage = "Error al registrar la venta";

            if (error.response) {
                if (error.response.data?.errors) {
                    
                    errorMessage = error.response.data.errors[0]?.msg || errorMessage;
                } else if (error.response.data?.error) {
                    
                    errorMessage = error.response.data.error;
                } else {
                    
                    errorMessage = error.response.statusText || error.message;
                }
            } else {
                
                errorMessage = error.message;
            }

            Notify.create({
                type: "negative",
                message: errorMessage,
                position: "top",
            });
            console.log(error);
            return { success: false };
        } finally {
            loading.value = false;
        }
    }

    let putVentas = async (id, venta) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/ventas/actualizar/${id}`, venta, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Venta Editada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };

        } catch (error) {
            let errorMessage = "Error al registrar la venta";

            if (error.response) {
                if (error.response.data?.errors) {
                    
                    errorMessage = error.response.data.errors[0]?.msg || errorMessage;
                } else if (error.response.data?.error) {
                    
                    errorMessage = error.response.data.error;
                } else {
                    
                    errorMessage = error.response.statusText || error.message;
                }
            } else {
                
                errorMessage = error.message;
            }

            Notify.create({
                type: "negative",
                message: errorMessage,
                position: "top",
            });
            console.log(error);
            return { success: false };
        } finally {
            loading.value = false;
        }
    }

    let toggleEstadoVentas = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/ventas/activar/${id}`
                : `api/ventas/desactivar/${id}`;
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
        getVentas, getVentasActivos, getVentasInactivos, getMantenimientoByVenta, getVentasPorFecha, postVentas, putVentas, toggleEstadoVentas, loading
    }
},
    {
        persist: true,
    },
)