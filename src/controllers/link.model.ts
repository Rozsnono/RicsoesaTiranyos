// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const linkSchema = new Schema(
    {
        _id: String,
        link: {
            type: String,
            required: true,
        },
    },
    { versionKey: false },
);

const onesideModel = model("links", linkSchema, "Links");

export default onesideModel;
