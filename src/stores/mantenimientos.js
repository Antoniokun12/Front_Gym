import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"

export const useMantenimentosStore = defineStore("mantenimientos", () => {

    const useUsuario = useUsuarioStore();

    const mantenimientos = ref([]);
    let loading = ref(false);

    let getMantenimientos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/mantenimientos`, {
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

    let getMantenimientosActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/mantenimientos/activos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            mantenimientos.value = res.data.mantenimientosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMantenimientosInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/mantenimientos/inactivos`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            mantenimientos.value = res.data.mantenimientosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getMantenimientoByMan = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`https://backend-gym-d82g.onrender.com/api/mantenimientos/maquina/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.mantenimiento;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let postMantenimientos = async (mantenimiento) => {
        loading.value = true;
        try {
            let req = await axios.post(`https://backend-gym-d82g.onrender.com/api/mantenimientos`, mantenimiento, {
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

    let putMantenimientos = async (id, mantenimiento) => {
        loading.value = true;
        try {
            let req = await axios.put(`https://backend-gym-d82g.onrender.com/api/mantenimientos/actualizar/${id}`, mantenimiento, {
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

    let toggleEstadoMantenimientos = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `https://backend-gym-d82g.onrender.com/api/mantenimientos/activar/${id}`
                : `https://backend-gym-d82g.onrender.com/api/mantenimientos/desactivar/${id}`;
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
        getMantenimientos, getMantenimientosActivos, getMantenimientosInactivos, getMantenimientoByMan, postMantenimientos, putMantenimientos, toggleEstadoMantenimientos, loading
    }
},
{
    persist:true,
},
)