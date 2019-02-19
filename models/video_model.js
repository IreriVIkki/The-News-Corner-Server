const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    videoId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    dateAdded: {
        type: String,
        default: Date.now
    },
    channel: {
        name: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true
        }
    }
});

module.exports = Video = mongoose.model("videos", VideoSchema);
