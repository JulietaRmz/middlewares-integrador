const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const multer= require('multer');
const registerMiddleware = require('../middlewares/registerMiddleware');
const loginMiddleware = require('../middlewares/loginMiddleware')
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const guest = require('../middlewares/guest');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/users')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
   
var upload = multer({ storage: storage })


//----------Rutas----------//

router.get('/register', guest, userController.showRegister);           // Muestra la vista de registro
router.post('/register', guest, upload.any(), registerMiddleware, userController.processRegister);       // Procesa la vista de registro
router.get('/login', guest, userController.showLogin);                 // Muestra la vista de login
router.post('/login', guest, loginMiddleware, userController.processLogin);             // Procesa la vista de login
router.get('/profile', auth, userController.showProfile);             // Muestra el perfil del usuario
router.get('/logout', auth, userController.logout);                   // Cierra la sesión

module.exports = router;