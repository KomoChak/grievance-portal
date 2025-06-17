const Category = require('../models/Category');

// Create Category
exports.addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Subcategory
exports.addSubcategory = async (req, res) => {
  const { categoryName, subcategoryName, description } = req.body;
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subcategories.push({ name: subcategoryName, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  const { categoryId, subcategoryName } = req.body;
  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subcategories = category.subcategories.filter(sc => sc.name !== subcategoryName);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
