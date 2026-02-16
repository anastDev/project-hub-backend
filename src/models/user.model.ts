import { Schema, model, Document } from "mongoose";

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

export interface IUserRole {
  role: string;
  description?: string;
  active?: boolean;
}

export interface IUser extends Document {
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  email: string;
  address?: IAddress;
  phone?: IPhone[];
  roles: IUserRole[];
}

const UserRoleSchema = new Schema<IUserRole>(
  {
    role: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
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
        type: [UserRoleSchema],
        required: true,
        default: [{ role: "READER", active: true }],
      },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export default model("User", UserSchema);
