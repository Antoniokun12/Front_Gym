import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useVentaStore = defineStore("venta", () => {

    const ventas = ref([]);

    let getVentas = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/ventas")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getVentasActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/ventas/activos")
            ventas.value = res.data.ventasActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getVentasInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/ventas/inactivos")
            ventas.value = res.data.ventasInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let postVentas = async (venta) => {
        try {
            let req = await axios.post("http://localhost:2500/api/ventas", venta);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putVentas = async (id, venta) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/ventas/actualizar/${id}`, venta);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoVentas = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/ventas/activar/${id}`
                : `http://localhost:2500/api/ventas/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    return {
        getVentas, getVentasActivos, getVentasInactivos, postVentas, putVentas, toggleEstadoVentas
    }
},
{
    persist:true,
},
)