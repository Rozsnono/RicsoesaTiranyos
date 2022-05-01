// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const linkSchema = new Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
        }
    },
    { versionKey: false },
);

const onesideModel = model("pages", linkSchema, "Pages");

export default onesideModel;
