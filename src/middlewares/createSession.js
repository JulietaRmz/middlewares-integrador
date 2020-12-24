const fs = require('fs');
const path = require('path');
const pathUsersJSON = path.resolve(__dirname + '/../database/users.json');
const usersJSON = fs.readFileSync(pathUsersJSON, 'utf-8');
const parsedUsers = JSON.parse(usersJSON);


module.exports = function(req, res ,next){
    if (req.cookies.user != 'undefined' && !req.session.user) {
        const userId = req.cookies.user
        req.session.user = parsedUsers.find(user=>user.id==userId);
    }
    return next()
}