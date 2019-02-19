const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    name: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    videos: [
        {
            video: {
                type: Schema.Types.ObjectId,
                ref: "videos"
            }
        }
    ]
});

module.exports = Playlist = mongoose.model("playlist", PlaylistSchema);
