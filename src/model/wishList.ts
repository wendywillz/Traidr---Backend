import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';
class WishList extends Model {
  public wishListId!: string;
  public userId!: string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    WishList.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

WishList.init(
  {
   wishListId: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId', 
      },
    }
  },
  {
    sequelize,
    modelName: 'WishList',
  }
);

export default WishList;


