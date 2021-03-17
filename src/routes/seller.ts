import express from "express";

import jwt from "jsonwebtoken";

//? Importing the seller model
import Seller, { ISeller } from "../db/seller";

const router = express.Router();

//~ The basic CRUD operations

//? Creating a seller
router.post("/seller", async (req, res) => {
  const data: ISeller = req.body;

  try {
    const seller = await new Seller(data).save();
    res.status(201).send(seller);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Seller" });
  }
});

//? Reading a seller
router.get("/seller", async (req, res) => {
  const data = req.body;

  try {
    const seller = await Seller.findById(data.id);
    res.status(200).send(seller);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Seller" });
  }
});

//? Updating a seller
router.put("/seller", async (req, res) => {
  const data = req.body;

  try {
    const seller = await Seller.findByIdAndUpdate(data.id, data, { new: true });
    res.status(201).send(seller);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Seller" });
  }
});

//? Deleting a seller
router.delete("/seller", async (req, res) => {
  const data = req.body;

  try {
    const seller = await Seller.findByIdAndDelete(data.id);
    res.status(200).send(seller);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Seller" });
  }
});

//~ Signing routes

//? Sign in route
router.post("/seller/login", async (req, res) => {
  const data = req.body;
  try {
    let token = await Seller.SignInToUser(data.email, data.password);
    if (!token) {
      throw new Error("Token not found");
    }
    res.send(token);
  } catch (e) {
    res.status(500).send(e);
  }
});

//? Sign out route
router.post("/seller/logout", async (req, res) => {
  const header = req.get("Authorization")?.replace("Bearer ", "")! as string;

  try {
    const token = jwt.verify(header, "1234567890") as { id: string };
    let seller = await Seller.findById(token.id);
    let tokens = seller?.tokens;
    tokens = tokens?.filter((e) => e !== header);
    seller = await Seller.findByIdAndUpdate(
      token.id,
      { tokens },
      { new: true }
    );
    res.send(seller?.tokens);
  } catch (e) {
    res.status(500).send(e);
  }
});

//? Sign out from all route
router.post("/seller/logout/all", async (req, res) => {
  const header = req.get("Authorization")?.replace("Bearer ", "")! as string;

  try {
    const token = jwt.verify(header, "1234567890") as { id: string };
    let seller = await Seller.findById(token.id);
    let tokens: string[] = [];
    seller = await Seller.findByIdAndUpdate(
      token.id,
      { tokens },
      { new: true }
    );
    res.send(seller?.tokens);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
