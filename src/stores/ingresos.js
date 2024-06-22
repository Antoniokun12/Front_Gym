import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useIngresoStore = defineStore("ingreso", () => {

    const ingresos = ref([]);
    let loading = ref(false);

    let getIngresos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/ingresos")
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
            let res = await axios.get("http://localhost:2500/api/ingresos/activos")
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
            let res = await axios.get("http://localhost:2500/api/ingresos/inactivos")
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
            let res = await axios.get(`http://localhost:2500/api/ingresos/ingresos/${id}`);
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
            let req = await axios.post("http://localhost:2500/api/ingresos", ingreso);
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
            let req = await axios.put(`http://localhost:2500/api/ingresos/actualizar/${id}`, ingreso);
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
                ? `http://localhost:2500/api/ingresos/activar/${id}`
                : `http://localhost:2500/api/ingresos/desactivar/${id}`;
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
        getIngresos, getIngresosActivos, getIngresosInactivos, getIngresosByID, postIngresos, putIngresos, toggleEstadoIngresos, loading
    }
},
{
    persist:true,
},
)
