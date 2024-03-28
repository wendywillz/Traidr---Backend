/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from "sequelize";
import sequelize from "../database/database.config";
import {v4 as uuidv4} from 'uuid';
class UserActivity extends Model{
    public id!: string;
    public userId!: string;
    public activeDuration!: number

    static associate(models: any): void {
        UserActivity.belongsTo(models.User, {foreignKey: `userId`, as: 'user'})
    }
}

UserActivity.init(
    {
        id: {
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
                key: 'userId'
            }
        },
        activeDuration: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'UserActivity'
    }
);

export default UserActivity;