const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/categoriesController');

router.post('/add-category', controller.addCategory);
router.post('/add-subcategory', controller.addSubcategory);
router.get('/', controller.getCategories);
router.delete('/delete-category/:id', controller.deleteCategory);
router.post('/delete-subcategory', controller.deleteSubcategory);

module.exports = router;


