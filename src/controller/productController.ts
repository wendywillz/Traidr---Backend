import { Request, Response } from 'express';
import Product from '../model/product';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL;

export const addNewProduct = async (req: Request, res: Response): Promise<void> => {
  try {
console.log("req.body", req.body)
    const { shopId } = req.params;
    // Check if photos are provided
    if (!(req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productPhoto) {
      res.json({ noPhoto: 'Photos are required' });
    } else {
      // Process the photo files as needed
      const photos = (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productPhoto;
      const video = (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productVideo ? (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productVideo[0] : null;
      const { productTitle, productDescription, productCategory, productPrice } = req.body;
      const insertPrice = parseFloat(productPrice);

      // Array to store photo paths
      const photoPaths:string[] = [];

      // Process each photo
      photos.forEach(photo => {
        // Construct the full path to the uploaded file
        const photoUndefinedPath = path.join(__dirname, "../../public/uploads", photo.filename);
        const renamedPhotoPath = photoUndefinedPath.replace(/undefined/g, productTitle);
        fs.renameSync(photoUndefinedPath, renamedPhotoPath);
        const photoPath = `${BACKEND_URL}/uploads/${renamedPhotoPath.split("uploads/")[1]}`;
        photoPaths.push(photoPath);
      });
console.log("photoPaths", photoPaths)
      // Process the video file
      let videoPath = null;
      if (video) {
        const videoUndefinedPath = path.join(__dirname, "../../public/uploads", video.filename);
        const renamedVideoPath = videoUndefinedPath.replace(/undefined/g, productTitle);
        fs.renameSync(videoUndefinedPath, renamedVideoPath);
        videoPath = `${BACKEND_URL}/uploads/${renamedVideoPath.split("uploads/")[1]}`;
      }

      // Create a new product with multiple photos
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
