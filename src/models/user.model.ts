import { Schema, model, Document, Types } from "mongoose";

export interface IPhone {
  type: string;
  number: string;
}

export interface IAddress {
  area?: string;
  street?: string;
  number?: string;
  po?: string;
  municipality?: string;
}

export interface IUser extends Document {
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  email: string;
  address?: IAddress;
  phone?: IPhone[];
  roles: Types.ObjectId[]
}

const AddressSchema = new Schema<IAddress>({
  area: String,
  street: String,
  number: String,
  po: String,
  municipality: String,
});

const PhoneSchema = new Schema<IPhone>(
  {
    type: String,
    number: String,
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is a required field"],
      unique: true,
      min: 4,
      max: 100,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: String,
    lastname: { type: String },
    email: {
      type: String,
      index: true,
      required: [true, "Email is a required field"],
    },
    address: AddressSchema,
    phone: {
      type: [PhoneSchema],
      null: true,
    },
    roles: [
      {
        type: Types.ObjectId,
        ref: "Role",
        required: true,
      },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export default model("User", UserSchema);
