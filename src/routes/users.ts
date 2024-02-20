import express from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res,) {
  res.send('respond with a resource');
});

export default router;

import express from "express";
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

export default router;
