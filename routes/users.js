/*
GET /: Página de inicio con formulario de inicio de sesión y enlace al panel de control.
POST /login: Endpoint para autenticar y generar un token JWT.
GET /dashboard: Panel de control accesible solo con un token JWT válido.
POST /logout: Endpoint para cerrar sesión y destruir la sesión. 
*/
const express = require('express');
const router = express.Router();
const {generateToken, verifyToken} = require("../middlewares/authMiddleware");

const users = require ("../data/users.js")

router.get('/', (req,res)=> {
    const loginUser = `
    <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required></br>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required></br>
        <button type="submit">Iniciar sesión</button>
    </form>
    <a href="/dashboard">dashboard</a>
    `;
    res.send(loginUser)
});

router.post('/login', (req,res) => {
    const {username, password} = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if(user){
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard')
    }else{
        res.status(401).json({message : 'usuario o contraseña incorrecta'})
    }
});

router.get('/dashboard', verifyToken, (req,res) => {
    const userId = req.user;
    const user = users.find((u) => u.id === userId)
    if(user){
        res.send(`
            <h1>Bienvenido ${user.name}</h1>
            <h2>Tu ID de usuario es: ${user.id}</h2>
            <h2>Tu nombre de usuario es: ${user.username}</h2>
            <form action="/logout" method="post">
                <button type="submit">Cerrar sesión</button>
            </form>
            <a href="/">Inicio</a>
        `)
    } else {
        res.status(401).json({message : 'Usuario no encontrado'})
    }
});

router.post('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/')
});

module.exports=router;