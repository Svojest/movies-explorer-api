const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFound');

const userRouter = require('./users');
const movieRouter = require('./movies');

const { createUser, login } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../constans/celebrateValidator');

const { ERROR_MESSAGE } = require('../constans/errors');

// Not protected routers
router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

// Protected routers
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

// Invalid router handler
router.use((req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGE.notFound));
});

module.exports = router;
