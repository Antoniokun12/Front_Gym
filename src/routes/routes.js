import { createRouter, createWebHashHistory } from 'vue-router';
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Inicio from "../components/Inicio.vue";
import Usuarios from "../components/Usuarios.vue";
import Ingresos from "../components/Ingresos.vue";
import Clientes from "../components/Clientes.vue";
import Planes from "../components/Planes.vue";
import Maquinas from "../components/Maquinas.vue";
import Sedes from "../components/Sedes.vue";
import Pagos from "../components/Pagos.vue";
import Inventario from "../components/Inventario.vue";
import Ventas from "../components/Ventas.vue";
import Mantenimientos from "../components/Mantenimientos.vue"
import { useUsuarioStore } from '../stores/usuarios';

const auth = (to, from, next) => {

  if (checkAuth()) {
      const userUsuario = useUsuarioStore()
      const rol = userUsuario.usuario.rol
      console.log(rol);
      if (!to.meta.rol.includes(rol)) {
          return next({ name: 'login' })
      }
      next()
  } else {
      return next({ name: 'login' })
  }
}

const checkAuth = () => {
  const useUsuario = useUsuarioStore()
  const token = useUsuario.token
  console.log(token);
  if (!token) return false
  return true
};


const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/home',
        name: 'Inicio',
        component: Inicio
      },
      {
        path: '/usuarios',
        name: 'Usuarios',
        component: Usuarios
      },
      {
        path: '/ingresos',
        name: 'Ingresos',
        component: Ingresos,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/clientes',
        name: 'Clientes',
        component: Clientes,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/planes',
        name: 'Planes',
        component: Planes,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/maquinas',
        name: 'Maquinas',
        component: Maquinas,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/sedes',
        name: 'Sedes',
        component: Sedes,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/pagos',
        name: 'Pagos',
        component: Pagos,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/inventario',
        name: 'Inventario',
        component: Inventario,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/ventas',
        name: 'Ventas',
        component: Ventas,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
      {
        path: '/mantenimientos',
        name: 'Mantenimientos',
        component: Mantenimientos,
        beforeEnter: auth, meta: { rol: ['Administrador'] }
      },
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})