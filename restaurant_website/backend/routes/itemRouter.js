import express from 'express';

import { getAllItems } from '../controllers/itemController.js';
import { saveItem } from '../controllers/itemController.js';
import { getGoodItems } from '../controllers/itemController.js';
import { searchItems } from '../controllers/itemController.js';

const itemRouter = express.Router();

itemRouter.get("/", getAllItems);
itemRouter.post("/", saveItem);
itemRouter.get("/good", getGoodItems);
itemRouter.get("/:name", searchItems);
export default itemRouter;