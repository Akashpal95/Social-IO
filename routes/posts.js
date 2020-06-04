const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller.js');


router.post('/create', passport.checkAuthentication,postsController.create);
//Passing request params
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);

module.exports = router;