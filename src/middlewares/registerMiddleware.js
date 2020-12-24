const {body} = require('express-validator');
const path = require('path');
const pathUsersJSON = path.resolve(__dirname + '/../database/users.json');
const fs = require('fs')
const usersJSON = fs.readFileSync(pathUsersJSON, 'utf-8');
const users = JSON.parse(usersJSON);



registerMiddleware=[
    body('email')
        .notEmpty()
            .withMessage('Debe ingresar un email')
            .bail()
        .isEmail()
            .withMessage('Debe ingresar un email válido')
            .bail()
        .custom(value => {
            let userFound=users.find(user=>user.email==value)
            return !userFound; 
        })
            .withMessage('El email ya se encuentra registrado')
            .bail(),
    body('password')
        .notEmpty()
            .withMessage('Debe ingresar una contraseña')
            .bail()
        .isLength({min:6})
            .withMessage('La contraseña debe tener 6 caracteres como mínimo')
        .custom(function (value, {req}) {
            return value==req.body.retype
        })
        .withMessage('Las contraseñas ingresadas deben coincidir')
        .bail(),
    body('retype')
        .notEmpty()
        .withMessage('Debe ingresar su contraseña nuevamente')
        .bail(),
    body('avatar')
        .custom(function(value, { req }){
            return req.files[0];
        })
        .withMessage('Debe ingresar una imagen')
        .bail()
        .custom(function(value,{req}){
            let image=req.files[0].originalname;
            let extension=path.extname(image);
            let admittedExtenssions= ['.jpg', '.jpeg' , '.png']
            return admittedExtenssions.includes(extension.toLowerCase())
            })
        .withMessage('Debe agregar una imagen en formato jpg/jpeg/png')
        
        
]

module.exports = registerMiddleware;