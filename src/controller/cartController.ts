import { Request, Response } from "express";
import Product from "../model/product";
import Cart from "../model/cart";
import CartItem from "../model/cartItem";
import ShopModel from "../model/shop";
import WishList from "../model/wishList";
import WishListItem from "../model/wishListItem";
import { config } from "dotenv";
config();
// const secret: string = process.env.secret as string;

import { getUserIdFromToken } from "../utils/getModelId";
import { createNewWishList } from "./wishListController";

// const BACKEND_URL = process.env.BACKEND_URL;

const createNewCart = async (currentUserId: string) => {
  const newUserCart = await Cart.create({
    userId: currentUserId,
  });
  return newUserCart;
};

//add to cart would execute on a post request from the frontend
export const addToCart = async (req: Request, res: Response) => {
  // const currentProductId = req.params.productId
  const currentUserId = await getUserIdFromToken(req, res);
  const { currentProductId, productQuantity } = req.body;

  const currentProduct = await Product.findByPk(currentProductId);
  if (!currentProduct) {
    res.json({ message: `Product does not exist` });
    return;
  }

  const productShopId = currentProduct?.shopId;
  const existingUserCart = await Cart.findOne({
    where: { userId: currentUserId },
  });

  let userCartId;
  if (!existingUserCart) {
    const newUserCart = await createNewCart(currentUserId);
    userCartId = newUserCart.dataValues?.cartId;

    await CartItem.create({
      cartId: userCartId,
      userId: currentUserId,
      productId: currentProductId,
      productQuantity: productQuantity,
      shopId: productShopId,
    });
  } else {
    userCartId = existingUserCart?.dataValues?.cartId;
  }

  const existingCartItem = await CartItem.findOne({
    where: { productId: currentProductId },
  });

  if (!existingCartItem) {
    try {
      await CartItem.create({
        cartId: userCartId,
        userId: currentUserId,
        productId: currentProductId,
        productQuantity: productQuantity,
        shopId: productShopId,
      });
    } catch (error) {
      res.json({ errorMessage: `error creating cartItem. Reason: ${error}` });
    }
  } else {
    await existingCartItem.update({
      productQuantity: productQuantity,
    });
  }

  res.json({ success: `CartItem created` });
};

//get all cart items per user.
export const getUserCartItems = async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req, res);
  const userCart = await Cart.findOne({ where: { userId: userId } });
  if (!userCart) {
    res.json({ message: `Cart Does not exist` });
    return;
  }
  const cartId = userCart?.dataValues?.cartId;

  const userCartItems = await CartItem.findAll({
    where: {
      cartId: cartId,
      userId: userId,
    },
  });

  if (!userCartItems) {
    res.json({ message: `Cart is empty` });
    return;
  }

  const cartProducts: Product[] = [];
  for (const item of userCartItems) {
    const cartProduct = await Product.findByPk(item.dataValues.productId);
    if (!cartProduct) {
      continue;
    }
    cartProducts.push(cartProduct);
  }

  interface CartProductDetail {
    productId: string;
    productTitle: string;
    productImage: string;
    productPrice: number;
    productQuantity: number;
    productTotal: number;
    sourceShop: string;
  }
  let cartProductDetail: CartProductDetail = {
    productId: "",
    productTitle: "",
    productImage: "",
    productPrice: 0,
    productQuantity: 0,
    productTotal: 0,
    sourceShop: "",
  };
  const cartProductDetails: CartProductDetail[] = [];

  for (const cartProduct of cartProducts) {
    const correspondingCartItem = await CartItem.findOne({
      where: { productId: cartProduct.dataValues.productId },
    });
    const correspondingShop = await ShopModel.findByPk(
      cartProduct.dataValues.shopId,
    );

    cartProductDetail = {
      productId: cartProduct.dataValues.productId,
      productTitle: cartProduct.dataValues.productTitle,
      productImage: cartProduct.dataValues.productImages[0],
      productPrice: cartProduct.dataValues.productPrice,
      productQuantity: correspondingCartItem?.dataValues?.productQuantity,
      productTotal: 0,
      sourceShop: correspondingShop?.dataValues.shopName,
    };
    cartProductDetails.push(cartProductDetail);
  }
  for (cartProductDetail of cartProductDetails) {
    cartProductDetail.productTotal =
      cartProductDetail.productPrice * cartProductDetail.productQuantity;
  }

  res.json({ cartProductDetails });
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const currentUserId = await getUserIdFromToken(req, res);
  const { productId } = req.body;

  const selectedCartItem = await CartItem.findOne({
    where: {
      userId: currentUserId,
      productId: productId,
    },
  });
  if (!selectedCartItem) {
    res.json({ message: `Item does not exist in cart` });
  }
  selectedCartItem?.destroy();
  res.json({ success: `CartItem deleted` });
};

export const moveItemToWishList = async (req: Request, res: Response) => {
  const currentUserId = await getUserIdFromToken(req, res);
  const { productId } = req.body;

  const selectedCartItem = await CartItem.findOne({
    where: {
      userId: currentUserId,
      productId: productId,
    },
  });
  if (!selectedCartItem) {
    res.json({ message: `Item does not exist in cart` });
    return;
  }

  const currentProduct = await Product.findByPk(productId);
  if (!currentProduct) {
    res.json({ message: `Product does not exist` });
    console.log(`Product ${productId} does not exist`);
    return;
  }

  const productShopId = currentProduct?.shopId;
  const existingUserWishList = await WishList.findOne({
    where: { userId: currentUserId },
  });

  let userWishListId;
  if (!existingUserWishList) {
    const newUserWishList = await createNewWishList(currentUserId);
    userWishListId = newUserWishList.dataValues?.wishListId;

    await WishListItem.create({
      wishListId: userWishListId,
      userId: currentUserId,
      productId: productId,
      shopId: productShopId,
    });
  } else {
    userWishListId = existingUserWishList?.dataValues?.wishListId;
  }
  const existingWishListItem = await WishListItem.findOne({
    where: { productId: productId },
  });

  if (!existingWishListItem) {
    try {
      await WishListItem.create({
        wishListId: userWishListId,
        userId: currentUserId,
        productId: productId,
        shopId: productShopId,
      });
      selectedCartItem.destroy();

      res.json({ success: `Item removed from cart and added to wishlist` });
    } catch (error) {
      res.json({
        errorMessage: `error creating wishListItem. Reason: ${error}`,
      });
      console.log(`Error creating wishList Item`);
    }
  } else {
    console.log(`Item is already in wishlist`);
    selectedCartItem.destroy();
    res.json({ success: `Item removed from cart but already to wishlist` });
  }
};

export const getCartCount = async (req: Request, res: Response) => {
  try {
    const currentUserId = await getUserIdFromToken(req, res);
    console.log(`currentUserId: ${currentUserId}`);
    const userCartItem = await Cart.findOne({
      where: { userId: currentUserId },
    });

    if (!userCartItem) {
      res.json({ message: `No such cart exists` });
      return;
    }
    const userCartId = userCartItem.dataValues.cartId;

    const userCartItems = await CartItem.findAll({
      where: {
        userId: currentUserId,
        cartId: userCartId,
      },
    });

    if (!userCartItems) {
      res.json({ message: `Cart Items not found` });
      return;
    }

    // const totalItems: number = userCartItems.reduce((acc, curr: CartItem) => {
    //   return acc + curr.productQuantity;
    // }, 0);

    // const cartCount = {
    //   totalCartCount: totalItems,
    // };
    
    const userCart: unknown[] = [];
    userCartItems.forEach((item) => {
      userCart.push({
        productId: item.dataValues.productId,
        productQuantity: item.dataValues.productQuantity,
      });
    });
    console.log("cartCount", userCart);
    res.json({ userCart });
  } catch (error) {
    console.log(`Error getting cart count: ${error}`);
    res.json({ error: `Error getting cart count` });
  }
};

/**
  const token = req.headers.authorization?.split(' ')[1]
  let userId;  
  if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { userEmail: string }
      const user = await User.findOne({
        where: { email: decoded.userEmail }
      })
      userId = user?.dataValues.userId
    }

    const userCart = await Cart.findByPk({where:{userId:userId}})
    if(!userCart){
        res.json({message: `Cart Does not exist`})
     }
     const cartId = userCart?.dataValues?.cartId
 */
