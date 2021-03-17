import express from "express";

//? Importing the product model
import Product from "../db/product";

const router = express.Router();

//~ The basic CRUD operations

//? Creating a product
router.post("/product", async (req, res) => {
  const data: unknown = req.body;

  try {
    const product = await new Product(data).save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Product" });
  }
});

//? Reading a product
router.get("/product", async (req, res) => {
  const data = req.body;

  try {
    const product = await Product.findById(data.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Product" });
  }
});

//? Updating a product
router.put("/product", async (req, res) => {
  const data = req.body;

  try {
    const product = await Product.findByIdAndUpdate(data.id, data, {
      new: true,
    });
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Product" });
  }
});

//? Deleting a product
router.delete("/product", async (req, res) => {
  const data = req.body;

  try {
    const product = await Product.findByIdAndDelete(data.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Product" });
  }
});

export default router;
