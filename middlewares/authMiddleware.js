// Este middleware manejará la generación del token y verificación.

const jwt = require('jsonwebtoken');

const hashedSecret = require("../crypto/config");
const users = require ("../data/users.js")

//1-Genero el token
function generateToken(user) {
    return jwt.sign({user: user.id}, hashedSecret,{expiresIn: '1h'});
}

//2-Verifico el token
function verifyToken(req,res,next) {
    const token = req.session.token;
    
    if(!token){
        return res.status(401).json({message: 'No se ha proporcionado el Token'})
    }
    jwt.verify(token, hashedSecret, (err,decoded) => {
        if(err){
            return res.status(401).json({message: 'Token incorrecto'})
        }
        
        req.user=decoded.user;
        next();
    });
}

module.exports = {generateToken,verifyToken};