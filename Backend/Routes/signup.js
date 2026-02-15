const express = require('express');
const router = express.Router();

const signup = require('../Controllers/signUpController');


router.post('/signup',  signup.signup.bind(signup));




module.exports = router;