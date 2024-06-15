import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const usePagoStore = defineStore("pago", () => {

    const pagos = ref([]);

    let getPagos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/pagos")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getPagosActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/pagos/activos")
            pagos.value = res.data.pagosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getPagosInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/pagos/inactivos")
            pagos.value = res.data.pagosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getPagosByID = async (id) => {
        try {
            let res = await axios.get(`http://localhost:2500/api/pagos/pagosx/cliente/${id}`);
            return res.data.pagos;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    let postPagos = async (pago) => {
        try {
            let req = await axios.post("http://localhost:2500/api/pagos", pago);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putPagos = async (id, pago) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/pagos/actualizar/${id}`, pago);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoPagos = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/pagos/activar/${id}`
                : `http://localhost:2500/api/pagos/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    return {
        getPagos, getPagosActivos, getPagosInactivos, getPagosByID, postPagos, putPagos, toggleEstadoPagos
    }
},
{
    persist:true,
},
)