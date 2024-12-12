import {Router} from 'express'
import { registro, confirmEmail, login, recuperarPassword, comprobarTokenPassword, nuevoPassword, perfilUsuario, cambiarContrasenia } from '../controllers/veterinario_controller.js'
import { verificarAutenticacion } from '../helpers/crearJWT.js'

const router = Router()
//Rutas públicas
router.post('/registro', registro)
router.get('/confirmar/:token', confirmEmail)
router.post('/login', login)
router.post('/recuperar-password',recuperarPassword)
router.get('/recuperar-password/:token', comprobarTokenPassword)
router.post('/nuevo-password/:token', nuevoPassword)
//Rutas privadas
router.get('/perfilvet', verificarAutenticacion,perfilUsuario)
router.post('/cambiar-password', verificarAutenticacion,cambiarContrasenia)
export default router