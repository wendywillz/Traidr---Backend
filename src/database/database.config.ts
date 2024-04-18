import { Sequelize } from "sequelize";
const DB = new Sequelize("hvkqzhdo", "hvkqzhdo", "0BKcywgd17oNtAAcn8iEjGXt4NwaRB8N",{
  dialect: 'postgres',
  host: 'trumpet.db.elephantsql.com',
  port: 5432,
  logging: false
 
 
})
export default DB;