import { Request, Response } from 'express';
import Product from '../model/product';
import ShopModel from '../model/shop';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL;

export const addNewProduct = async (req: Request, res: Response): Promise<void> => {
 try {
    console.log("req.body", req.body)
    const { shopId } = req.params;
    if (!(req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productPhoto) {
      res.json({ noPhoto: 'Photos are required' });
    } else {
      const photos = (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productPhoto;
      const video = (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productVideo ? (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productVideo[0] : null;
      const { productTitle, productDescription, productCategory, productPrice } = req.body;
      const insertPrice = parseFloat(productPrice);
      const shopOwner = await ShopModel.findOne({ where: { shopId } });
      
      const photoPaths:string[] = [];

      photos.forEach(photo => {
        const sanitizedTitle = productTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Example sanitization
        const newFilename = `${sanitizedTitle}_${shopOwner?.dataValues.shopName}_${Date.now()}${path.extname(photo.filename)}`; // Example filename construction
        const photoUndefinedPath = path.join(__dirname, "../../public/uploads", photo.filename);
        const renamedPhotoPath = path.join(__dirname, "../../public/uploads", newFilename);
        fs.renameSync(photoUndefinedPath, renamedPhotoPath);
        const photoPath = `${BACKEND_URL}/uploads/${newFilename}`;
        console.log("photoPath", photoPath)
        photoPaths.push(photoPath);
      });

      console.log("photoPaths", photoPaths)

      let videoPath = null;
      if (video) {
        const sanitizedTitle = productTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Example sanitization
        const newFilename = `${sanitizedTitle}_`; // Example filename construction
        const videoUndefinedPath = path.join(__dirname, "../../public/uploads", video.filename);
        const renamedVideoPath = path.join(__dirname, "../../public/uploads", newFilename);
        fs.renameSync(videoUndefinedPath, renamedVideoPath);
        videoPath = `${BACKEND_URL}/uploads/${newFilename}`;
      }

      await Product.create({
        productTitle,
        productDescription,
        productCategory,
        productImages: photoPaths, 
        productVideo: videoPath,
        productPrice: insertPrice,
        shopId
      });

      res.json({ productAdded: 'Product added successfully' });
    }
 } catch (error) {
    console.log('Error adding product:', error);
    res.json({ error: 'Error uploading files' });
 }
};



export const getProductsByShopId = async (req: Request, res: Response): Promise<void> => { 
  try {
    const { shopId } = req.params;
    const products = await Product.findAll({ where: { shopId } });
    res.json({ products });
  } catch (error) {
    console.log('Error getting products:', error)
    res.json({ error: 'Error getting products' });
  }
}

export const getAllProducts = async (req: Request, res: Response): Promise<void> => { 
  try {

    const products = await Product.findAll();
    console.log("products")
    res.json({ products });
  } catch (error) {
    console.log('Error getting products:', error)
    res.json({ error: 'Error getting products' });
  }
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = (req.params.productId);

      // Mock product data
      // const mockProducts = [
      //   { id: 1, name: 'Product 1', price: 10.99 },
      //   { id: 2, name: 'Product 2', price: 20.99 },
      //   { id: 3, name: 'Product 3', price: 30.99 },
      // ];
    // const product = mockProducts.find(p => p.id === productId);

    const product = await Product.findByPk(productId);

    if(!product) {
      res.json({ error: 'Product not found' });
      return;
    }
    res.json({product});

  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.json({ error: 'Error getting products' });
  }
}