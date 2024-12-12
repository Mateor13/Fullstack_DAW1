import {sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import {generarJWT} from "../helpers/crearJWT.js"
import Veterinario from "../models/Veterinario.js"

const registro = async (req,res) => {
  
    //Paso 1 -Tomar datos del request 
    const {email, password} = req.body
    //Paso 2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debes llenar todos los campos"})

    const verificarEmailBDD = await Veterinario.findOne({email})
    if (verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos el email ya se encuentra registrado"})
    //Paso 3 - Interactuar BDD
    const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)
    const token = nuevoVeterinario.crearToken()
    await sendMailToUser(email,token)
    await nuevoVeterinario.save()
    res.status(200).json({msg:"Revisa tu correo electronico para confirmar tu cuenta"})
}
const confirmEmail = async (req, res) => {
  //Paso 1 - Tomar datos del request 
    const {token} = req.params
  //Paso 2 - Validar datos
  if (!(token)) return res.status(400).json({msg:"Lo sentimos no se puede validar la cuenta"})
const  veterinarioBDD = await Veterinario.findOne({token})
  if(!veterinarioBDD?.token) return res.status(400).json({msg:"La cuenta ya ha sido confirmada"})

    //Paso 3 - Interactuar BDD
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail = true
    await veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"})
}

const login = async (req, res) => {
    const {email, password} = req.body
    //Paso 2
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debes llenar todos los campos"})
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -updatedAt -createdAt")
// ? = Encadenamiento opcional
    if (veterinarioBDD?.confirmEmail === false) return res.status(400).json({msg:"Lo sentimos debes verificar tu cuenta"})
    if (!veterinarioBDD) return res.status(400).json({msg:"Lo sentimos el email no se encuentra registrado"})
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(400).json({msg:"Lo sentimos el password no es el correcto"})
    //Paso 3 - Interactuar BDD
    const tokenJWT = generarJWT(veterinarioBDD._id, "veterinario")
    res.status(200).json({veterinarioBDD, tokenJWT})
} 

const recuperarPassword = async (req, res) => {
  const {email} = req.body

  if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debes llenar todos los campos"})
    const veterinarioBDD = await Veterinario.findOne({email})
  if (!veterinarioBDD) return res.status(400).json({msg:"Lo sentimos el email no se encuentra registrado"})
  const token = veterinarioBDD.crearToken()
  veterinarioBDD.token = token
  await sendMailToRecoveryPassword(email, token)
  await veterinarioBDD.save()
  res.status(200).json({msg:"Revisa tu correo electronico para reestablecer tu contraseña"})
}

const comprobarTokenPassword = async (req, res) => {
  const {token} = req.params

  if (!(token)) return res.status(400).json({msg:"Lo sentimos no se puede validar la cuenta"})
  const veterinarioBDD = await Veterinario.findOne({token})

  if(veterinarioBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se pudo validar la cuenta"})

  await veterinarioBDD.save()
  res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"})
}

const nuevoPassword = async (req, res) => {
  const {password, confirmpassword} = req.body
  if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debes llenar todos los campos"})
  if ( password != confirmpassword) return res.status(400).json({msg:"Lo sentimos, los passwords no coinciden"})
  const  veterinarioBDD = await Veterinario.findOne({token: req.params.token})
  if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se pudo validar la cuenta"})

  console.log(req.params.token)
  veterinarioBDD.token = null
  veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
  await veterinarioBDD.save()
  res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"})
}

const perfilUsuario = (req, res) => {
  //console.log(req.veterinarioBDD)
  const {_id} = req.veterinarioBDD
  console.log(_id)
  res.send("Perfil del Usuario")
}

const cambiarContrasenia = async(req, res) => {
  const {antiguopassword, password, confirmpassword} = req.body
  const {id} = req.params

  if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debes llenar todos los campos"})
  if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg:"Id no encontrado"})
  if (password != confirmpassword) return res.status(400).json({msg:"Lo sentimos, los nuevos passwords no coinciden"})
  const veterinarioBDD = await Veterinario.findOne({id})
  
  const validarPassword = veterinarioBDD.matchPassword(antiguopassword)
  if(!validarPassword) return res.status({msg:"Contaseña actual incorrecta"})
  veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
  await veterinarioBDD.save()
  res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"})
}

export {
  registro,
  confirmEmail,
  login,
  recuperarPassword,
  comprobarTokenPassword,
  nuevoPassword,
  perfilUsuario,
  cambiarContrasenia
}