const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const {check,validationResult,body} = require('express-validator');

const pathUsersJSON = path.resolve(__dirname + '/../database/users.json');
const usersJSON = fs.readFileSync(pathUsersJSON, 'utf-8');
const parsedUsers = JSON.parse(usersJSON);

function getNewId() { 
    const users = JSON.parse(fs.readFileSync(pathUsersJSON, 'utf-8'))
    if (users.id==undefined)   {
        return 1;               
      } 
    return(users.pop().id) +1 ;     
}

function writeUsers(array) {
    const usersJson = JSON.stringify(array, null, " ");
    fs.writeFileSync(pathUsersJSON, usersJson); 
}
      


module.exports = {
    showRegister: (req, res) => {
        return res.render('user/user-register-form');
    },

    processRegister: (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.render('user/user-register-form', {errors: errors.mapped(), userEmail : req.body.email})
        }

        const users = parsedUsers;
        const passwordHashed= bcrypt.hashSync(req.body.password, 5);
        const newUser = {
            id: getNewId(),
            email: req.body.email,
            avatar: req.files[0].filename,
            password: passwordHashed
        }
        const usersToSave = [...users,newUser];
        writeUsers(usersToSave);

        return res.redirect('/user/login');
    },

    showLogin: (req, res) => {
        return res.render('user/user-login-form');
    },
    processLogin: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.render('user/user-login-form' , {errors: errors.mapped(), email: req.body.email})
        }

        const users = parsedUsers;
        const password = req.body.password;
        const userExist = users.find(user => user.email == req.body.email);
        if(userExist && bcrypt.compareSync(password, userExist.password)){
            req.session.user = userExist;
            if(req.body.remember) {
                res.cookie('user', userExist.id, {maxAge: 1000*60*15})
            }
            return res.redirect('/user/profile');
        }
        res.redirect('/user/login');
    },

    showProfile: (req, res) => {
        return res.render('user/profile');
    },
    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie('user');

        return res.redirect('/');
    }

}