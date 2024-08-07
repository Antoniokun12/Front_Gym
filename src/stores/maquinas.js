import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"
import { Notify } from "quasar";

export const useMaquinaStore = defineStore("maquina", () => {

    const useUsuario = useUsuarioStore();

    const maquinas = ref([]);
    let loading = ref(false);

    let getMaquina = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/maquinas`, {
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

    let getMaquinasActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/maquinas/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            maquinas.value = res.data.maquinasActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMaquinasInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/maquinas/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            maquinas.value = res.data.maquinasInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMaquinaByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/maquinas/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.maquina;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let postMaquina = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/maquinas`, r, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Maquina registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };

        } catch (error) {
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            })
            console.log(error);
            return { success: false };
        } finally {
            loading.value = false;
        }
    }

    let putMaquina = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/maquinas/actualizar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Maquina Editada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };

        } catch (error) {
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            })
            console.log(error);
            return { success: false };
        } finally {
            loading.value = false;
        }
    }

    let toggleEstadoMaquina = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/maquinas/activar/${id}`
                : `api/maquinas/desactivar/${id}`;
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
        getMaquina, getMaquinasActivos, getMaquinasInactivos, getMaquinaByID, postMaquina, putMaquina, toggleEstadoMaquina, loading
    }
},
    {
        persist: true,
    })
