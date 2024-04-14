import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
class WishListItem extends Model {
  public wishListItemId!: number;
  public wishListId!: string;
  public userId!: string;
  public productId!: string;
  public shopId!: string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    WishListItem.hasMany(models.Product, {foreignKey: `productId`, as: 'product'});
    WishListItem.belongsTo(models.WishList, { foreignKey: 'wishListId', as: 'wishList' });
  }
}

WishListItem.init(
  {
   wishListItemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    wishListId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'WishLists',
        key: 'wishListId', 
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId', 
      },
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'productId', 
        },
      },
    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Shops',
        key: 'shopId', 
      },
    },
  },
  {
    sequelize,
    modelName: 'WishListItem',
  }
);

export default WishListItem;


