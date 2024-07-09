import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { Notify } from "quasar";
import { useUsuarioStore } from "../stores/usuarios.js"


export const usePlanStore = defineStore("plan", () => {

    const useUsuario = useUsuarioStore();
    const planes = ref([]);
    let loading = ref(false);

    let getPlanes = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/planes`, {
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

    let getPlanesActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/planes/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            planes.value = res.data.planesActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getPlanesInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/planes/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            planes.value = res.data.planesInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getPlanesByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/planes/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.plan;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let postPlanes = async (plan) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/planes`, plan, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `PLan registrado correctamente`,
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

    let putPlanes = async (id, plan) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/planes/actualizar/${id}`, plan, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `PLan Editado correctamente`,
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

    let toggleEstadoPlanes = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/planes/activar/${id}`
                : `api/planes/desactivar/${id}`;
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
        getPlanes, getPlanesActivos, getPlanesInactivos, getPlanesByID, postPlanes, putPlanes, toggleEstadoPlanes, loading
    }
},
    {
        persist: true,
    },
)
