const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
    {
        message: { 
            type: String, 
            required: true 
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dateTime: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Messages", MessageSchema);