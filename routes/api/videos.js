const express = require("express");
const router = express.Router();
const isEmpty = require("../../validation/is_empty");
var fetchVideoInfo = require("youtube-info");

// @Import  Imports the Playlist schema from models
const Playlist = require("../../models/playlists_schema");
const Video = require("../../models/video_model");

// @Route   Get api/videos/test
// @Desc    Tests if this api endpoint is working
// @access  Public
router.get("/test", (req, res) => {
    res.json({ msg: "videos Works" });
});

// @Route   Get api/videos
// @Desc    Get all videos from the database
// @access  Public
router.get("/", (request, response) => {
    Video.find().exec((err, videos) => {
        if (err) {
            response.status(500).json(err);
            return;
        }
        response
            .status(200)
            .json({ videosFound: "List of the videos found", videos: videos });
    });
});

// @Route   Get api/videos/:id
// @Desc    Get a video by id from the database
// @access  Public
router.get("/:id", (request, response) => {
    const video_id = request.params.id;
    Video.findById(video_id).exec((err, video) => {
        if (err || isEmpty(video)) {
            response.status(500).json({
                videoNotFound: `Video with id ${video_id} not found`,
                Error: err
            });
            return;
        }
        response.status(200).json({
            videoFound: `Video with id ${video_id} found`,
            Error: video
        });
    });
});

// @Route   Post api/videos/
// @Desc    Post a new video to the database
// @access  Public
router.post("/", async (request, response) => {
    const video_id = request.body.videoId;

    Video.findOne({ videoId: video_id }).exec(async (err, video) => {
        if (err) {
            response.status(500).json({
                videoNotFound: "Video not found",
                Error: err
            });
            return;
        }
        if (isEmpty(video)) {
            await fetchVideoInfo(video_id)
                .then(videoInfo => {
                    const {
                        videoId,
                        title,
                        thumbnailUrl,
                        duration,
                        owner,
                        channelId
                    } = videoInfo;

                    video = new Video({
                        videoId: videoId,
                        title: title,
                        thumbnailUrl: thumbnailUrl,
                        length: duration,
                        channel: {
                            channelId: channelId,
                            name: owner
                        }
                    });

                    video
                        .save()
                        .then(video =>
                            response.status(200).json({
                                newVideoCreated: "New Video added to db",
                                video: video
                            })
                        )
                        .catch(err => {
                            response.status(500).json({
                                playlistNotCreated: "Video Was Not Created",
                                Error: err
                            });
                            return;
                        });
                })
                .catch(err => {
                    response.status(500).json({
                        invalidVideoId: `Invalid video id ${video_id}`,
                        Error: err
                    });
                    return;
                });
        } else {
            response
                .status(300)
                .json({
                    videoAlreadyExists: `Video with id ${video_id} already exists`,
                    Video: video
                });
        }
    });
});

// @Route   Get api/videos/:id
// @Desc    Get a video by id from the database
// @access  Public
router.delete("/:id", (request, response) => {
    const video_id = request.params.id;
    Video.findOneAndDelete({ _id: video_id }).exec((err, video) => {
        if (err || isEmpty(video)) {
            response.status(500).json({
                videoNotDeleted: `Video with id ${video_id} not deleted`,
                Error: err
            });
            return;
        }
        response.status(200).json({
            videoDeleted: `Video with id ${video_id} deleted successfuly`,
            video: video
        });
    });
});
module.exports = router;
