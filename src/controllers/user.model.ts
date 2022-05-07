// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const linkSchema = new Schema(
    {
        _id: Number,
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { versionKey: false },
);

const onesideModel = model("users", linkSchema, "Users");

export default onesideModel;
