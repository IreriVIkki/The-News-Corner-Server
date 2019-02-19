const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema("user item structure", {
    name: {
        type: String,
        required: true
    }
});

module.exports = User = mongoose.model("users", userSchema);
