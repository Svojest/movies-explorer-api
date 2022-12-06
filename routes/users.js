const router = require('express').Router();

const { updateUser, getCurrentUser } = require('../controllers/users');
const { updateUserValidator } = require('../constans/celebrateValidator');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserValidator, updateUser);

module.exports = router;