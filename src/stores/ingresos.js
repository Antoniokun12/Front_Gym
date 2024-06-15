import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useIngresoStore = defineStore("ingreso", () => {

    const ingresos = ref([]);

    let getIngresos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/ingresos")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getIngresosActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/ingresos/activos")
            ingresos.value = res.data.ingresosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getIngresosInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/ingresos/inactivos")
            ingresos.value = res.data.ingresosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getIngresosByID = async (id) => {
        try {
            let res = await axios.get(`http://localhost:2500/api/ingresos/ingresos/${id}`);
            return res.data.ingresos;
        } catch (error) {
            console.log(error);
            return error;
        }
    }


    let postIngresos = async (ingreso) => {
        try {
            let req = await axios.post("http://localhost:2500/api/ingresos", ingreso);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putIngresos = async (id, ingreso) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/ingresos/actualizar/${id}`, ingreso);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoIngresos = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/ingresos/activar/${id}`
                : `http://localhost:2500/api/ingresos/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    return {
        getIngresos, getIngresosActivos, getIngresosInactivos, getIngresosByID, postIngresos, putIngresos, toggleEstadoIngresos
    }
},
{
    persist:true,
},
)
