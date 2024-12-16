import Router from 'express'
import { actualizarPaciente, detallePaciente, eliminarPaciente, listarPaciente, loginPaciente, perfilPaciente, registrarPaciente } from '../controllers/paciente_controller.js'
import { verificarAutenticacion } from '../helpers/crearJWT.js'
const router = Router()

router.post('/paciente/login', loginPaciente)
router.get('/paciente/perfil', verificarAutenticacion,perfilPaciente)

router.post('/paciente/registro', verificarAutenticacion, registrarPaciente)
router.get('/pacientes', verificarAutenticacion, listarPaciente)
router.get('/paciente/:id', verificarAutenticacion, detallePaciente)
router.put('/paciente/actualizar/:id', verificarAutenticacion, actualizarPaciente)
router.delete('/paciente/eliminar/:id', verificarAutenticacion, eliminarPaciente)


export default router