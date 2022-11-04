const asyncHandler = require('express-async-handler');
const Product = require('../models/productSchema');
const cloudinary = require('cloudinary').v2;

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: 'CatShup',
        resource_type: 'image',
      });
    } catch (error) {
      res.status(500);
      throw new Error('Image could not be uploaded');
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileId: uploadedFile.public_id,
    };
  }

  // Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json(products);
});

// Get a Product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  // if product doesn't exist
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error('User not authorized');
  }

  res.status(200).json(product);
});

// Delete a Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  // if product doesn't exist
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error('User not authorized');
  }

  try {
    deletedFile = await cloudinary.uploader.destroy(product.image.fileId, {
      resource_type: 'image',
    });
  } catch (error) {
    res.status(500);
    throw new Error('Image could not be deleted');
  }
  await product.remove();
  res.status(200).json({ message: 'Product deleted' });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  res.send('Update');
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
