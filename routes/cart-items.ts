import express from 'express';
import { getClient } from '../db';
import { ObjectId } from 'mongodb';
import CartItem from '../model/CartItem';

const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const results = await client.db().collection<CartItem>('cartItems').find().toArray();
    console.log(results)
    console.log(client.db().databaseName)
    res.json(results); // send JSON results
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const item = await client.db().collection<CartItem>('cartItems').findOne({ _id : new ObjectId(id) });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({message: "Not Found"});
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.post("/", async (req, res) => {
  const item = req.body as CartItem;
  try {
    const client = await getClient();
    const result = await client.db()
      .collection<CartItem>('cartItems')
      .insertOne(item);
      item._id = result.insertedId;
      res.status(201).json(item);
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
  
});

route.put("/:id", async (req, res) => {
  const id = req.params.id;
  const item = req.body as CartItem;
  delete item._id;
  try {
    const client = await getClient();
    const result = await client.db().collection<CartItem>('cartItems').replaceOne({ _id: new ObjectId(id) }, item);
    if (result.modifiedCount === 0) {
      res.status(404).json({message: "Not Found"});
    } else {
      item._id = new ObjectId(id);
      res.json(item);
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client.db().collection<CartItem>('cartItems')
      .deleteOne({_id: new ObjectId(id) });
      if (result.deletedCount === 0 ) {
        res.status(404).json({message: "Nount Found"});
      } else {
        res.status(204).end();
      }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

export default route;