const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const protectMiddleware = require('../middlewares/protectMiddleware');

// Especial endpoints
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', protectMiddleware.protect, authController.updatePassword)
router.patch('/updateMe', protectMiddleware.protect, userController.updateMe)
router.patch('/deleteMe', protectMiddleware.protect, userController.deleteMe)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
