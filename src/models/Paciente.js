import mongoose, {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'
import veterinario from './Veterinario.js'

//Schema
const pacienteSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    propietario:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    },
    celular:{
        type:String,
        require:true,
        trim:true
    },
    convecional:{
        type:String,
        require:true,
        trim:true
    },
    ingreso:{
        type:Date,
        require:true,
        trim:true,
        default:Date.now()
    },
    sintomas:{
        type:String,
        require:true,
        trim:true
    },
    salida:{
        type:Date,
        require:true,
        trim:true,
        default:Date.now()
    },
    estado:{
        type:Boolean,
        default:true
    },
    veterinario:{
        //Relacionar con otro modelo
        type:mongoose.Schema.Types.ObjectId,
        ref:'Veterinario'
    }
})

//Metodos
//Metodo para cifrar el password del paciente
pacienteSchema.methods.encrypPassword= async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}
//Metodo para verificar el password del paciente
pacienteSchema.methods.matchPassword= async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

//Creación del modelo y su exportación
export default model('Paciente', pacienteSchema)