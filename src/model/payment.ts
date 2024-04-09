import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';

class PaymentDetails extends Model {
  public paymentMethod!: string;
  public businessName!: string;
  public businessDescription!: string;
  public streetAddress!: string;
  public city!: string;
  public zipCode!: string;
  public state!: string;
  public country!: string;
}

PaymentDetails.init({
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'PaymentDetails',
});

export default PaymentDetails;


