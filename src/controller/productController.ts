import { Request, Response } from 'express';
import Product from '../model/product';
 
export const addingNewProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productTitle, productDescription, productCategory, productPrice, shopId } = req.body;
 
    
    const newProduct = await Product.create({
      productTitle,
      productDescription,
      productCategory,
      productPrice,
      shopId
    });
 
    res.status(201).json({ success: true, message: 'Product uploaded successfully', data: newProduct });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};