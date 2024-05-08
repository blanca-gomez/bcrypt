const express = require('express');
const app = express();
const session = require('express-session')
const port = 3000;

const routes = require("./routes/users")
const hashedSecret = require("./crypto/config");

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(
session({
secret: hashedSecret,
resave:false,
saveUninitialized: true,
cookie: {secure: false},
})
);

app.use('/', routes);

app.listen(port, () => {
    console.log(`Express is listen on port http://localhost:${port}`)
})