import { DataTypes, Model } from "sequelize";
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';
class LastActive extends Model{
    public id!: string;
    public userId!: string;
    public lastActiveAt!: Date;
}

LastActive.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'userId'
        },
        allowNull: false
        },
        
    lastActiveAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'LastActive'
})
export default LastActive;