import { Document, model, Model, Schema } from "mongoose";

//? The packages to authenticate
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//^ Interfaces to easily deal with data

//& Error interfaces
interface IErrorInFindingUser {
  errorMsg: string;
  httpCode: number;
}

//* Success interfaces

interface ISuccessFindingUser {
  token: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

//? Interfaces and functions to deal with type checking
// interface ICheckErrorFunction {
//   //  (data: ISuccessFindingUser | IErrorInFindingUser) : IErrorInFindingUser;
//   (data: any) : IErrorInFindingUser;

// }

// // const instanceOfError:ICheckErrorFunction = (data:any) : data is IErrorInFindingUser {
// //   return "errorMsg" in data;
// // }

// interface ICheckSuccessFunction {
//   (data: ISuccessFindingUser | IErrorInFindingUser): ISuccessFindingUser;
// }

//? The schema to the buyer model
const buyerSchema: Schema = new Schema(
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
    affiliateLink: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

//? the instance methods to the buyer model

//^ Hashing passwords before saving them
buyerSchema.pre<IBuyer>("save", async function (next) {
  this.pw = await bcrypt.hash(this.pw, 8);
  next();
});

//? the static methods to the buyer model
buyerSchema.statics.SignInToUser = async function (
  email: string,
  password: string
): Promise<ISuccessFindingUser | IErrorInFindingUser> {
  let buyer = await Buyer.findOne({ em: email });
  if (!buyer) {
    return {
      errorMsg: "User doesn't exists",
      httpCode: 406,
    };
  }

  let isMatch = await bcrypt.compare(password, buyer.pw);
  if (!isMatch) {
    return {
      errorMsg: "Invalid authentication information",
      httpCode: 406,
    };
  }

  let token = jwt.sign({ id: buyer._id }, "1234567890");

  if (!token) {
    return {
      errorMsg: "There is a problem with generating a token",
      httpCode: 500,
    };
  }

  await Buyer.findByIdAndUpdate(buyer._id, {
    tokens: buyer.tokens.concat([token]),
  });

  return {
    token,
    firstName: buyer.fn,
    lastName: buyer.ln,
    age: buyer.a,
    email: buyer.em,
  };
};

//? the buyer model
interface IBuyer extends Document {
  fn: string;
  ln: string;
  pw: string;
  em: string;
  a: number;
  img: any[];
  tokens: string[];
  affiliateLink: string[];
}

interface IBuyerModel extends Model<IBuyer> {
  SignInToUser: (
    email: string,
    password: string
  ) => Promise<ISuccessFindingUser | IErrorInFindingUser>;
}

const Buyer: IBuyerModel = model<IBuyer, IBuyerModel>("Buyer", buyerSchema);

export default Buyer;
export { ISuccessFindingUser, IErrorInFindingUser };
