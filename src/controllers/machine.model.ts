// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const machineSchema = new Schema(
    {
        _id: Number,
        type: {
            type: String,
            required: true,
        },
        specs: {
            type: Object,
            required: true,
        },
    },
    { versionKey: false },
);

const onesideModel = model("machines", machineSchema, "Machines");

export default onesideModel;
