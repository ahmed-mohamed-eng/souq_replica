import express from "express";
import "./db/mongoose";

//? Importing the custom routes
import buyerRoute from "./routes/buyer";
import imageRoute from "./routes/image";
import sellerRoute from "./routes/seller";
import productRoute from "./routes/product";

const app = express();
const port: number = 3030 || process.env.PORT;

//? Using the necessary middleware(s) to parse in-coming payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//? Making the Home page return status code and message "hello world"
app.all("/", (_, res) => {
  res.status(200).send({ message: "Hello World" });
});

//? Using the custom routes here
app.use(buyerRoute);
app.use(sellerRoute);
app.use(imageRoute);
app.use(productRoute);

//? Running the server
app.listen(port, () => console.log(`The server is running on port ${port}`));
