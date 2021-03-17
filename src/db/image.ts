import { Document, model, Model, Schema } from "mongoose";

//? The schema to the image model
const imageSchema = new Schema(
  {
    in: {
      type: String,
      alias: "imageName",
      required: true,
    },
    t: {
      type: String,
      alias: "type",
      required: true,
    },
    img: {
      alias: "image",
      type: Buffer,
      required: true,
    },
    s: {
      type: Number,
      alias: "size",
      required: true,
    },
    u: {
      type: Schema.Types.ObjectId,
      alias: "user",
      // required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

//? the instance methods to the image model

//? the static methods to the image model

//? the image model
interface IImageDocument extends Document {
  in: string;
  t: string;
  s: number;
  u: string;
  img: Buffer;
}

interface IImageModel extends Model<IImageDocument> {}

const Image: IImageModel = model<IImageDocument, IImageModel>(
  "Image",
  imageSchema
);

export default Image;
