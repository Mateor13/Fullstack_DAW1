import { sendMailToPaciente } from "../config/nodemailer.js"
import Paciente from "../models/Paciente.js"

const registrarPaciente = async (req, res) => {
    //Paso 1 -Tomar datos del request
    const {email} = req.body

    //Paso 2 - Validar datos
    if (Object.values(req.body).includes(' ')) return res.status(400).json({msg:'Debe llenar todos los datos'})
    const verificarEmailBDD = await Paciente.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({error:"Lo sentimos, el email ya se encuentra registrado"}) 

    //paso 3 - Interactuar BDD 
    const nuevoPaciente = new Paciente(req.body)
    const password = Math.random().toString(36).slice(2)
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("vet"+password) 
    await sendMailToPaciente(email, "vet"+password)
    nuevoPaciente.veterinario= req.veterinarioBDD._id
    await nuevoPaciente.save()
    res.status(200).json({msg:"Registro existoso del paciente"})
}

const listarPaciente = (req, res) => {
    //Paso 1 -Tomar datos del request
    //Paso 2 - Validar datos
    //paso 3 - Interactuar BDD  
}

const detallePaciente = (req, res) => {
    res.send('Detalle de Paciente')  
}
const actualizarPaciente = (req, res) => {
    res.send('Paciente actualizado')  
}
const eliminarPaciente = (req, res) => {
    res.send('Paciente eliminado')  
}

const loginPaciente = (req, res) => {
    res.send('Dueño inicio sesión con éxito')  
}

const perfilPaciente = (req, res) => {
    res.send('Dueño puede ver su perfil')  
}
export {
    registrarPaciente,
listarPaciente,
detallePaciente,
actualizarPaciente,
eliminarPaciente,
loginPaciente,
perfilPaciente}
