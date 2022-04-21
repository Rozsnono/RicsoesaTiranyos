// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const linkSchema = new Schema(
    {
        _id: Number,
        link: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        subs: {
            type: Number,
            required: false,
        }
    },
    { versionKey: false },
);

const onesideModel = model("links", linkSchema, "Links");

export default onesideModel;
