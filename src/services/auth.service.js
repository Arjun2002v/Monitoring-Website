
const { use } = require("react");
const prisma = require("../prisma")
const jwt = require("jsonwebtoken");

//Registering the user

const registerUser = async (name,email,password)=>{

    const existing = await prisma.user.findUnique({
        where:{
            email
        }

    })

      if (existing) {
        throw new Error("User already exists");
    }

    const hashedPassWord = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
      data:{
        name:name,
        password:hashedPassWord,
        email:email
      }
    })

    return {
        name:user.name,
        email:user.email,
        id:user.id
    }

}

//Login new user

const loginUser = async (email,password) =>{

    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(!user){
        throw new Error("Invalid user or password")

    }

    const passwordMatch = await bcrypt.compare(password,user.password)
    if(!passwordMatch){
        throw new Error("Invalid Password")
    }

    const token = jwt.sign({
        userId:user.id
    },
process.env.JWT_SECRET,{
    expiresIn:"1h"
})

  return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };

}

module.exports = {
    registerUser,
    loginUser
};