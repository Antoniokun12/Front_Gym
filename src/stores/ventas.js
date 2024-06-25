import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"

export const useVentaStore = defineStore("venta", () => {

    const useUsuario = useUsuarioStore();

    const ventas = ref([]);
    let loading = ref(false);

    let getVentas = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/ventas", {
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
            let res = await axios.get("http://localhost:2500/api/ventas/activos", {
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
            let res = await axios.get("http://localhost:2500/api/ventas/inactivos", {
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

    let postVentas = async (venta) => {
        loading.value = true;
        try {
            let req = await axios.post("http://localhost:2500/api/ventas", venta, {
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

    let putVentas = async (id, venta) => {
        loading.value = true;
        try {
            let req = await axios.put(`http://localhost:2500/api/ventas/actualizar/${id}`, venta, {
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

    let toggleEstadoVentas = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `http://localhost:2500/api/ventas/activar/${id}`
                : `http://localhost:2500/api/ventas/desactivar/${id}`;
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
        getVentas, getVentasActivos, getVentasInactivos, postVentas, putVentas, toggleEstadoVentas, loading
    }
},
{
    persist:true,
},
)