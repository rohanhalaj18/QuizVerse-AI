const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { getAllUsers, toggleBanUser, getPlatformAnalytics, createCategory, deleteCategory, changeUserRole } = require('../controllers/adminController');

router.use(protect, authorize('admin'));
router.get('/users', getAllUsers);
router.patch('/users/:id/ban', toggleBanUser);
router.patch('/users/:id/role', changeUserRole);
router.get('/analytics', getPlatformAnalytics);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
