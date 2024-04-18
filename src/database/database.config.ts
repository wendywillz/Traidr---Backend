import { Sequelize } from 'sequelize'
const DB = new Sequelize('fzuuapxy','fzuuapxy','QRiT7cxPfcXaP-sgvRjSrLZIgnJYxfQY', 
  {
    host: "flora.db.elephantsql.com",
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

export default DB;  
/*
APi key: fff263ab-c52e-4f3f-bd2b-b8040dcac78b
*/

// import { Sequelize } from "sequelize";
// const DB = new Sequelize("hvkqzhdo", "hvkqzhdo", "0BKcywgd17oNtAAcn8iEjGXt4NwaRB8N",{
//   dialect: 'postgres',
//   host: 'trumpet.db.elephantsql.com',
//   port: 5432,
//   logging: false
 
 
// })
// export default DB;