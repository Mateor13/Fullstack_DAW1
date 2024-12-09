import {Router} from 'express'
import { registro, confirmEmail, login } from '../controllers/veterinario_controller.js'

const router = Router()
router.post('/registro', registro)
router.get('/confirmar/:token', confirmEmail)
router.post('/login', login)
export default router