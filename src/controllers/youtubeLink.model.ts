// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";

const youtubeSchema = new Schema(
    {
        _id: Number,
        link: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        running: {
            type: Boolean,
            required: true
        },
        type: {
            type: Array,
            required: false
        }
    },
    { versionKey: false },
);

const onesideModel = model("youtube", youtubeSchema, "Youtube");

export default onesideModel;
