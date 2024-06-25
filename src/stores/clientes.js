import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"


export const useClienteStore = defineStore("cliente", () => {

    const useUsuario = useUsuarioStore();
    const clientes = ref([]);
    let loading = ref(false);
    const seguimientoEditado = ref(null);

    let getClientes = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/clientes", {
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

    let getClientesActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/clientes/activos", {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            clientes.value = res.data.clientesActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getClientesInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get("http://localhost:2500/api/clientes/inactivos", {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            clientes.value = res.data.clientesInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false;
        }
    }

    let getClienteByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`http://localhost:2500/api/clientes/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.cliente;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    }

    let postCliente = async (cliente) => {
        loading.value = true;
        try {
            let req = await axios.post("http://localhost:2500/api/clientes", cliente, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return req.data;

        } catch (error) {
            console.error("Error en postCliente:", error.response?.data);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    let addSeguimiento = async (clienteId, seguimiento) => {
        loading.value = true;
        try {
            await axios.post(`http://localhost:2500/api/clientes/${clienteId}/seguimiento`, { seguimiento }, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
        } catch (error) {
            console.error('Error al agregar seguimiento:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    let editarSeguimiento = async (id, updateseguimiento) => {
        loading.value = true;
        try {
            console.log('ID del seguimiento a editar:', id); 
            await axios.put(`http://localhost:2500/api/clientes/seguimiento/${id}`, updateseguimiento, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };
    

    let putCliente = async (id, cliente) => {
        loading.value = true;
        try {
            let req = await axios.put(`http://localhost:2500/api/clientes/actualizar/${id}`, cliente, {
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

    let toggleEstadoCliente = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `http://localhost:2500/api/clientes/activar/${id}`
                : `http://localhost:2500/api/clientes/desactivar/${id}`;
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
        getClientes, getClientesActivos, getClienteByID, getClientesInactivos, postCliente, addSeguimiento, editarSeguimiento, putCliente, toggleEstadoCliente, loading
    }
},
    {
        persist: true,
    },
)
