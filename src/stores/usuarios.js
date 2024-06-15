import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const useUsuarioStore = defineStore("usuario", () => {

    let token=ref("");
    let usuario = ref(null);
    const usuarios = ref([]);

    let getUsuarios = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/usuarios")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getUsuariosActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/usuarios/activos")
            usuarios.value = res.data.usuariosActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getUsuariosInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/usuarios/inactivos")
            usuarios.value = res.data.usuariosInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getUsuarioByID = async (id) => {
        try {
            let res = await axios.get(`http://localhost:2500/api/usuarios/${id}`, {
                headers: {
                    "x-token": token.value,
                },
            });
            return res.data.usuario;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    
    let login = async (l) => {
        try {
            let req = await axios.post("http://localhost:2500/api/usuarios/login", l)
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
        }
    }

    let postUsuario = async (r) => {
        try {
            let req = await axios.post("http://localhost:2500/api/usuarios", r, {
                headers: {
                    "x-token": token.value,
                },
            });
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let putUsuario = async (id, data) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/usuarios/actualizar/${id}`, data, {
                headers: {
                    "x-token": token.value,
                },
            });
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoUsuario = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/usuarios/activar/${id}`
                : `http://localhost:2500/api/usuarios/desactivar/${id}`;
            let req = await axios.put(url, {}, {
                headers: {
                    "x-token": token.value,
                },
            });
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    const clearUsuario = () => {
        usuario.value = null;
        token.value = null;
    }

    return {
        getUsuarios, getUsuariosActivos, getUsuariosInactivos, getUsuarioByID, login, postUsuario, putUsuario, toggleEstadoUsuario, token, usuario, clearUsuario
    }
},
{
    persist:true,
})