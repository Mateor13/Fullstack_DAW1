import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'

const veterinarioSchema = new Schema ({
nombre:{
    type:String,
    require:true,
    trim:true
},
apellido:{
    type:String,
    require:true,
    trim:true
},
direccion:{
    type:String,
    trim:true,
    default:null
},
telefono:{
    type:Number,
    trim:true,
    default:null
},
email:{
    type:String,
    require:true,
    trim:true,
    unique:true
},
token:{
    type:String,
    default:null
},
password:{
    type:String,
    require:true
},
status:{
    type:Boolean,
    default:true
},
confirmEmail:{
    type:Boolean,
    default:false
}},
{
    timestamps:true
})

//Metodos
//Metodo para cifrar el password frl veterinario
veterinarioSchema.methods.encrypPassword= async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}
//Metodo para verificar el password frl veterinario
veterinarioSchema.methods.matchPassword= async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

//Metodo para crear un token
veterinarioSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}
//Modelo
export default model('Veterinario', veterinarioSchema)
