import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { Notify } from "quasar";

export const useUsuarioStore = defineStore("usuario", () => {

    let token = ref("");
    let usuario = ref(null);
    const usuarios = ref([]);
    let loading = ref(false);

    let getUsuarios = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/usuarios`, {
                headers: {
                    "x-token": token.value,
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

    let getUsuariosActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/usuarios/activos`, {
                headers: {
                    "x-token": token.value,
                },
            });
            usuarios.value = res.data.usuariosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getUsuariosInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/usuarios/inactivos`, {
                headers: {
                    "x-token": token.value,
                },
            });
            usuarios.value = res.data.usuariosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getUsuarioByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/usuarios/${id}`, {
                headers: {
                    "x-token": token.value,
                },
            });
            return res.data.usuario;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let login = async (l) => {
        loading.value = true
        try {
            let req = await axios.post(`api/usuarios/login`, l);
            console.log(req);
            if (req.status === 200) {
                token.value = req.data.token;
                usuario.value = req.data.usuario;
                console.log(token);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    let postUsuario = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/usuarios`, r, {
                headers: {
                    "x-token": token.value,
                },
            });
            Notify.create({
                message: `Usuario registrado correctamente`,
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

    let putUsuario = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/usuarios/actualizar/${id}`, data, {
                headers: {
                    "x-token": token.value,
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

    let toggleEstadoUsuario = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/usuarios/activar/${id}`
                : `api/usuarios/desactivar/${id}`;
            let req = await axios.put(url, {}, {
                headers: {
                    "x-token": token.value,
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

    let forgotPassword = async (email) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/usuarios/forgot-password`, { email });
            console.log(req);
            return req.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let resetPassword = async (token, newPassword, confirmPassword) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/usuarios/reset-password/${token}`, { newPassword, confirmPassword });
            console.log(req);
            return req.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    const clearUsuario = () => {
        usuario.value = null;
        token.value = null;
    }

    return {
        getUsuarios,
        getUsuariosActivos,
        getUsuariosInactivos,
        getUsuarioByID,
        login,
        postUsuario,
        putUsuario,
        toggleEstadoUsuario,
        token,
        usuario,
        clearUsuario,
        forgotPassword,
        resetPassword,
        loading
    }
},
    {
        persist: true,
    })
