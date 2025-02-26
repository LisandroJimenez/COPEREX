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
        enum: ["Profesional", "SemiProfesional", "Amateur"]
    },
    experience: {
        type: String,
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