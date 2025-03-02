import { Schema, model } from "mongoose";

const EnterpriseSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    impactLevel: {
        type: String,
        required: true,
        enum: ["Professional", "Semiprofessional", "Amateur"]
    },
    yearsExperience: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
    versionKey: false
}
)


export default model ("Enterprise", EnterpriseSchema)