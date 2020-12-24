const {body} = require('express-validator');
const bcrypt = require('bcryptjs');
const path = require('path');
const pathUsersJSON = path.resolve(__dirname + '/../database/users.json');
const fs = require('fs')
const usersJSON = fs.readFileSync(pathUsersJSON, 'utf-8');
const users = JSON.parse(usersJSON);


loginMiddleware=[
    body('email')
        .notEmpty()
            .withMessage('Debe ingresar su email')
            .bail()
        .custom((value, {req}) => {
            let userFound = users.find(user => user.email == value)
            return userFound && bcrypt.compareSync(req.body.password, userFound.password)
        })
            .withMessage('El email o la contraseña ingresados son incorrectos')
            .bail(),
    body('password')
        .notEmpty()
                .withMessage('Debe ingresar su contraseña')
                .bail()

]

module.exports = loginMiddleware;