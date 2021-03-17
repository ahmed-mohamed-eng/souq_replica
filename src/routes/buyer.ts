import express from "express";

//? Importing the buyer model
import Buyer, { IErrorInFindingUser, ISuccessFindingUser } from "../db/buyer";

//? Package to verify token
import jwt from "jsonwebtoken";

const router = express.Router();

//^ Interfaces to easily deal with request data
interface ILoginData {
  email: string;
  password: string;
}

//~ The basic CRUD operations

//? Creating a buyer
router.post("/buyer", async (req, res) => {
  const data: unknown = req.body;

  try {
    const buyer = await new Buyer(data).save();
    res.status(201).send(buyer);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Buyer" });
  }
});

//? Reading a buyer
router.get("/buyer", async (req, res) => {
  const data = req.body;

  try {
    const buyer = await Buyer.findById(data.id);
    res.status(200).send(buyer);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Buyer" });
  }
});

//? Updating a buyer
router.put("/buyer", async (req, res) => {
  const data = req.body;

  try {
    const buyer = await Buyer.findByIdAndUpdate(data.id, data, { new: true });
    res.status(201).send(buyer);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Buyer" });
  }
});

//? Deleting a buyer
router.delete("/buyer", async (req, res) => {
  const data = req.body;

  try {
    const buyer = await Buyer.findByIdAndDelete(data.id);
    res.status(200).send(buyer);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Buyer" });
  }
});

//~ Signing routes

//? Sign in route
router.post("/buyer/login", async (req, res) => {
  const data: ILoginData = req.body;
  try {
    const userData = await Buyer.SignInToUser(data.email, data.password);
    const errorData = userData as IErrorInFindingUser;
    const successData = userData as ISuccessFindingUser;

    if (successData.token) {
      const { token, firstName, lastName, age, email } = successData;
      res.send({ token, firstName, lastName, age, email });
    } else if (errorData.errorMsg) {
      res.status(errorData.httpCode).send({
        errorMessage: errorData.errorMsg,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

//? Sign out route
router.post("/buyer/logout", async (req, res) => {
  const header = req.get("Authorization")?.replace("Bearer ", "")! as string;

  try {
    const token = jwt.verify(header, "1234567890") as { id: string };
    let buyer = await Buyer.findById(token.id);
    let tokens = buyer?.tokens;
    tokens = tokens?.filter((e) => e !== header);
    buyer = await Buyer.findByIdAndUpdate(token.id, { tokens });
    res.send(buyer?.tokens);
  } catch (e) {
    res.status(500).send(e);
  }
});

//? Sign out from all route
router.post("/buyer/logout/all", async (req, res) => {
  const header = req.get("Authorization")?.replace("Bearer ", "")! as string;

  try {
    const token = jwt.verify(header, "1234567890") as { id: string };
    let buyer = await Buyer.findById(token.id);
    let tokens: string[] = [];
    buyer = await Buyer.findByIdAndUpdate(token.id, { tokens }, { new: true });
    res.send(buyer?.tokens);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
