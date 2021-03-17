import { Document, Model, model, Schema } from "mongoose";

//? The packages to authenticate
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//? The schema to the seller model
const sellerSchema = new Schema(
  {
    fn: {
      type: String,
      alias: "firstName",
      maxlength: 30,
      minlength: 8,
      trim: true,
      required: true,
    },
    ln: {
      type: String,
      alias: "lastName",
      maxlength: 30,
      minlength: 8,
      trim: true,
      required: true,
    },
    img: [
      {
        alias: "image",
        ref: "Image",
        type: Schema.Types.ObjectId,
      },
    ],
    pw: {
      type: String,
      alias: "password",
      minlength: 8,
      required: true,
    },
    em: {
      type: String,
      alias: "email",
      minlength: 10,
      required: true,
      unique: true,
    },
    tokens: [{ type: String }],
    a: {
      type: Number,
      alias: "age",
      min: 12,
      required: true,
    },
  },
  { timestamps: true }
);

//? the instance methods to the seller model
//^ Hashing passwords before saving them
sellerSchema.pre<ISeller>("save", async function (next) {
  this.pw = await bcrypt.hash(this.pw, 8);
  next();
});
//? the static methods to the seller model
sellerSchema.statics.SignInToUser = async function (
  email: string,
  password: string
): Promise<string | null> {
  let seller = await Seller.findOne({ em: email });
  if (!seller) {
    return null;
  }

  let isMatch = await bcrypt.compare(password, seller.pw);
  if (!isMatch) {
    return null;
  }

  let token = jwt.sign({ id: seller._id }, "1234567890");

  if (!token) {
    return null;
  }

  await Seller.findByIdAndUpdate(seller._id, {
    tokens: seller.tokens.concat([token]),
  });

  return token;
};

//? the seller model
interface ISeller extends Document {
  fn: string;
  ln: string;
  pw: string;
  em: string;
  a: number;
  tokens: string[];
}
interface ISellerModel extends Model<ISeller> {
  SignInToUser: (email: string, password: string) => Promise<string | null>;
}

const Seller: ISellerModel = model<ISeller, ISellerModel>(
  "Seller",
  sellerSchema
);

export { ISeller };
export default Seller;
