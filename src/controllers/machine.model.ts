// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const machineSchema = new Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        specs: {
            type: Array,
            required: true,
        },
        specsPic: {
            type: String,
            required: true,
        },
        software: {
            type: Array,
            required: false,
        },
        perif: {
            type: Array,
            required: true,
        },
    },
    { versionKey: false },
);

const onesideModel = model("machines", machineSchema, "Machines");

export default onesideModel;
