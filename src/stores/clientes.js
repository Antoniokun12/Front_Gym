import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "../stores/usuarios.js"


export const useClienteStore = defineStore("cliente", () => {

    const useUsuario = useUsuarioStore();
    const clientes = ref([]);

    let getClientes = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/clientes")
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getClientesActivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/clientes/activos")
            clientes.value = res.data.clientesActivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getClientesInactivos = async () => {
        try {
            let res = await axios.get("http://localhost:2500/api/clientes/inactivos")
            clientes.value = res.data.clientesInactivos || [];
            console.log(res);
            return res.data

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let getClienteByID = async (id) => {
        try {
            let res = await axios.get(`http://localhost:2500/api/clientes/${id}`);
            return res.data.cliente;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    let postCliente = async (cliente) => {
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
        }
    }

    let addSeguimiento = async (clienteId, seguimiento) => {
        try {
            await axios.post(`http://localhost:2500/api/clientes/${clienteId}/seguimiento`, { seguimiento });
        } catch (error) {
            console.error('Error al agregar seguimiento:', error);
            throw error;
        }
    }

    let putCliente = async (id, cliente) => {
        try {
            let req = await axios.put(`http://localhost:2500/api/clientes/actualizar/${id}`, cliente);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    let toggleEstadoCliente = async (id, activar) => {
        try {
            const url = activar
                ? `http://localhost:2500/api/clientes/activar/${id}`
                : `http://localhost:2500/api/clientes/desactivar/${id}`;
            let req = await axios.put(url);
            return req.data;

        } catch (error) {
            console.log(error);
            return error
        }
    }

    return {
        getClientes, getClientesActivos, getClienteByID, getClientesInactivos, postCliente, addSeguimiento, putCliente, toggleEstadoCliente
    }
},
    {
        persist: true,
    },
)
