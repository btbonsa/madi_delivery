const express = require('express');
const router = express.Router();

const login = require('../Controllers/LoginController');


router.post('/login',  login.login.bind(login));

module.exports = router;
