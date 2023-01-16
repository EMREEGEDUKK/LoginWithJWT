const router = require('express').Router();
const {login,register,mainPage}  = require('../Controllers/authControllers');
const { checkUser }  = require('../Middlewares/authMiddlewares');

router.post('/',checkUser);
router.post('/register',register);
router.post('/login',login);


module.exports  = router 