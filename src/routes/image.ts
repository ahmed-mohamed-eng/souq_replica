import express from "express";

//? Importing a package to deal with images
import multer from "multer";

const upload = multer();

//? Importing the image model
import Image from "../db/image";

const router = express.Router();

//~ The basic CRUD operations

//? Creating a image
router.post("/image", upload.single("img"), async (req, res) => {
  const file = req.file;

  try {
    const image = await new Image({
      in: file.originalname,
      t: file.mimetype,
      s: file.size,
      img: file.buffer,
    }).save();
    res.status(201).send(image._id);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Image" });
  }
});

//? Reading an image
router.get("/image", async (req, res) => {
  const data = req.body;

  try {
    const image = await Image.findById(data.id);
    if (image) res.status(200).send(image.in);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Image" });
  }
});

//? Updating a image
router.put("/image", upload.single("img"), async (req, res) => {
  const { file, body: data } = req;

  try {
    const image = await Image.findByIdAndUpdate(
      data.id,
      {
        in: file.filename,
        t: file.mimetype,
        s: file.size,
        img: file.buffer,
      },
      { new: true }
    );
    res.status(201).send(image?._id);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Image" });
  }
});

//? Deleting a image
router.delete("/image", async (req, res) => {
  const data = req.body;

  try {
    const image = await Image.findByIdAndDelete(data.id);
    res.status(200).send(image?._id);
  } catch (err) {
    res.status(500).send({ err, loc: "C R Image" });
  }
});

export default router;
