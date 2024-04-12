

import { Sequelize } from "sequelize";
const DB = new Sequelize("wqsmzjza", "wqsmzjza", "f-_9BIwS8-atgSnUKRAvJZ_7BPti-uAM",{
  dialect: 'postgres',
  host: 'trumpet.db.elephantsql.com',
  port: 5432,
  logging: false
 
 
})
export default DB;




