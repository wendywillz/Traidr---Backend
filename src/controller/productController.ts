import { Request, Response } from 'express';
import Product from '../model/product';
import path from 'path';

export const addNewProduct = async (req: Request, res: Response): Promise<void> => {
 try {
    // Check if photo is provided
    if (!(req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productPhoto) {
      res.json({ noPhoto: 'Photo is required' });
    } else {
      // Process the photo and video files as needed
      const photo = (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productPhoto[0];
      const video = (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productVideo ? (req.files as unknown as { [fieldname: string]: Express.Multer.File[]; }).productVideo[0] : null;
      const { productTitle, productDescription, productCategory, productPrice, shopId } = req.body;
      const insertPrice = parseFloat(productPrice);

      // Construct the full path to the uploaded files
      const photoPath = path.join(__dirname, "../../public/uploads", photo.filename);
      const videoPath = video ? path.join(__dirname, "../../public/uploads", video.filename) : null;
      console.log("photoPath", photoPath, "videoPath", videoPath)
      // Create a new product
      await Product.create({
        productTitle,
        productDescription,
        productCategory,
        productImage: photoPath,
        productVideo: videoPath,
        productPrice: insertPrice,
        shopId
      });

      res.json({ productAdded: 'Product added successfully' })
    }
 } catch (error) {
   console.log('Error adding product:', error)
    res.json({ error: 'Error uploading files' });
 }
};
