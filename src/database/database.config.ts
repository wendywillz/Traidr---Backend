import { Sequelize } from 'sequelize'

const DB = new Sequelize('hvkqzhdo','hvkqzhdo','0BKcywgd17oNtAAcn8iEjGXt4NwaRB8N', 
  {
    host: "trumpet.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    logging: false,
   
    pool: {
      max:  5,
      min:  0,
      idle:  300000,
      acquire:  10000,
    },
  }
);

export default DB;