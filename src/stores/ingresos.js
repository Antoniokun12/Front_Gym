import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { Notify } from "quasar";
import { useUsuarioStore } from "../stores/usuarios.js"

export const useIngresoStore = defineStore("ingreso", () => {

    const useUsuario = useUsuarioStore();

    const ingresos = ref([]);
    let loading = ref(false);

    let getIngresos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/ingresos`, {
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
            let res = await axios.get(`api/ingresos/activos`, {
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
            let res = await axios.get(`api/ingresos/inactivos`, {
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
            let res = await axios.get(`api/ingresos/ingresos/${id}`, {
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

    let getIngresosPorFecha = async (fecha) => {
        loading.value = true;
        try {
            let res = await axios.get(`/api/ingresos/fecha/${fecha}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
                params: { busqueda: fecha }  // Pasar la fecha como parámetro de consulta
            });
            ingresos.value = res.data.ingresos || [];
            console.log(res);
            return res.data;
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
            let req = await axios.post(`api/ingresos`, ingreso, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Ingreso registrado correctamente`,
                color: "positive",
                position: "top",
            });
            return req.data;

        } catch (error) {
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            })
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let putIngresos = async (id, ingreso) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/ingresos/actualizar/${id}`, ingreso, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Ingreso Editado correctamente`,
                color: "positive",
                position: "top",
            });
            return req.data;

        } catch (error) {
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            })
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
                ? `api/ingresos/activar/${id}`
                : `api/ingresos/desactivar/${id}`;
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
        getIngresos, getIngresosActivos, getIngresosInactivos, getIngresosByID, getIngresosPorFecha, postIngresos, putIngresos, toggleEstadoIngresos, loading
    }
},
{
    persist:true,
},
)
