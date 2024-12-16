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

const listarPaciente = async (req, res) => {
    //Paso 1 -Tomar datos del request
    //Paso 2 - Validar datos
    //paso 3 - Interactuar BDD  
    //const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select('-salida -createdAt -updatedAt -__v')
    const pacientes = await Paciente.find({estado:true}).populate('veterinario',"nombre apellido").select("-__v -estado -password").where('veterinario').equals(req.veterinarioBDD)
    if (pacientes.length === 0) return res.status(400).json({msg:"No se han registrado pacientes todavía"})
    res.status(200).json(pacientes)
}

const detallePaciente = (req, res) => {
    //Paso 1 -Tomar datos del request
    //Paso 2 - Validar datos
    //paso 3 - Interactuar BDD   
}
const actualizarPaciente = (req, res) => {
    //Paso 1 -Tomar datos del request
    //Paso 2 - Validar datos
    //paso 3 - Interactuar BDD  
}
const eliminarPaciente = (req, res) => {
    //Paso 1 -Tomar datos del request
    //Paso 2 - Validar datos
    //paso 3 - Interactuar BDD   
}

const loginPaciente = (req, res) => {
    //Paso 1 -Tomar datos del request
    //Paso 2 - Validar datos
    //paso 3 - Interactuar BDD   
}

const perfilPaciente = (req, res) => {
    //Paso 1 -Tomar datos del request
    //Paso 2 - Validar datos
    //paso 3 - Interactuar BDD   
}
export {
    registrarPaciente,
listarPaciente,
detallePaciente,
actualizarPaciente,
eliminarPaciente,
loginPaciente,
perfilPaciente}
