import { Schema, model } from "mongoose";

const AddressSchema = new Schema({
  area: String,
  street: String,
  number: String,
  po: String,
  municipality: String,
});

const PhoneSchema = new Schema(
  {
    type: String,
    number: String,
  },
  { _id: false }
);

const UserSchema = new Schema(
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
    },
    address: AddressSchema,
    phone: {
      type: [PhoneSchema],
      null: true,
    },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: true }],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export default model("User", UserSchema);
