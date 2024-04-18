import { Request, Response } from 'express';
import Product from '../model/product';
import ShopModel from '../model/shop';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import User from '../model/user';
import { Op } from 'sequelize';
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL;

export const addNewProduct = async (req: Request, res: Response): Promise<void> => {
 try {
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



export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const productDetails = await Product.findOne({ where: { productId } });
    const shopDetails = await ShopModel.findOne({ where: { shopId: productDetails?.dataValues.shopId } });
    const shopOwner = await User.findOne({ where: { userId: shopDetails?.dataValues.shopOwner } });
    const similarProducts = await Product.findAll({ where: { productCategory: productDetails?.dataValues.productCategory } });
    const product = { ...productDetails?.dataValues, shopName: shopDetails?.dataValues.shopName, shopOwner: shopOwner?.dataValues.name, similarProducts: similarProducts, shopOwnerEmail: shopOwner?.dataValues.email};
    
    res.json({ product });
  } catch (error) {
    console.log('Error getting products:', error)
    res.json({ error: 'Error getting products' });
  }}

  export const getAllProducts = async (req: Request, res: Response): Promise<void> => { 
    try {
  
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 9;
      const offset = (page - 1) * pageSize;
      
  
      const { minPrice, maxPrice, price, search, category, sort, color } = req.query;
   
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereCondition: any = {};
  
      if (price){
        whereCondition.productPrice = price
  
        } else if(minPrice && maxPrice){
    whereCondition.productPrice = {
      [Op.between]: [minPrice,maxPrice]
  
    };
  } else if (maxPrice ) {
        whereCondition.productPrice = {
          [Op.lte]: +maxPrice
  
        } ;
      } else if (minPrice ) {
        whereCondition.productPrice = {
          [Op.gte]: +minPrice
        };
      }
    
  if(search){
    whereCondition.productTitle = {
      [Op.iLike] : `%${search}%`
    } 
  }
  
    if (category){
      whereCondition.productCategory = {
      [Op.iLike] : `%${category}`
      }
    }
  
  
    let sortOrder: [string, string] = ["productPrice", "ASC"];
    
    if (sort === "high"){
      sortOrder = [ "productPrice", "DESC" ]
    }
  
    else if ( sort === "low"){
     sortOrder = ["productPrice", "ASC"] 
    }
  
  if (sort === "most-recent"){
    sortOrder = [ "updatedAt", "DESC"]
  }
  
  if(color){
    whereCondition.productTitle = {
        [Op.iLike] : `%${color}%`
      };
      // whereCondition.productDescription = {
      //   [Op.iLike] : `%${color}%`
      // }
    }
    
  
      const products = await Product.findAll({
        where: whereCondition,
        order: [sortOrder],
        offset,
        limit: pageSize, 
      });
  

  
      res.json({products});
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

export const getProductCount = async(req:Request, res:Response):Promise<void>=>{
  try {
    const totalProductCount = await Product.count()
    const productCount = {
      totalProductCount: totalProductCount
    }
    res.json({productCount})
  } catch (error) {
    res.json({error:`${error}`})
  }
  
  
}
  
  
  