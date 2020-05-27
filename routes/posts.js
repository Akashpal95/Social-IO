const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_controller.js');


router.post('/status', postsController.postStatus);

module.exports = router;