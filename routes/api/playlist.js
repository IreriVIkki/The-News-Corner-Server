const express = require("express");
const router = express.Router();
const isEmpty = require("../../validation/is_empty");
var fetchVideoInfo = require("youtube-info");

// @Import  Imports the Playlist schema from models
const Playlist = require("../../models/playlists_schema");
const Video = require("../../models/video_model");

// @Route   Get api/playlists/test
// @Desc    Tests if this api endpoint is working
// @access  Public}
router.get("/test", (req, res) => {
    res.json({ msg: "Playlists Works" });
});

// @Route   Get api/playlists
// @Desc    Gets a list of all playlists
// @access  Public
router.get("/", (req, res) => {
    Playlist.find()
        .sort({ lastUpdated: -1 })
        .then(items => res.json(items))
        .catch(err =>
            res.status(404).json({ nopostsfound: "No posts found", error: err })
        );
});

// @route   GET api/playlists/:id
// @desc    Get playlist by id
// @access  Private
router.get("/:id", (req, res) => {
    Playlist.findById(req.params.id)
        .then(playlist => {
            console.log(playlist);
            if (!playlist) {
                res.status(404).json({
                    noPlaylistFound: "No playlist found with that id"
                });
            } else {
                res.json(playlist);
            }
        })
        .catch(err => {
            res.status(404).json({
                noPlaylistFound: "No playlist found with that id",
                error: err
            });
        });
});

// @Route   Post api/playlists
// @Desc    Posts a new playlist to the database
// @access  Public
router.post("/", (req, res) => {
    console.log(isEmpty(req.body.name));
    // check if the req object is empty return error object if so
    if (isEmpty(req.body.name)) {
        res.status(500).json({ nameIsRequired: "Playlist Name Not Found!" });
        return;
    }

    const newPlaylist = new Playlist({
        name: req.body.name
    });

    newPlaylist
        .save()
        .then(playlist => res.json(playlist))
        .catch(err =>
            res.status(500).json({
                playlistNotCreated: "Playlist Was Not Created",
                Error: err
            })
        );
    // res.json(newPlaylist)
});

// @Route   Put api/playlists/add_video/:id
// @Desc    Adds toggles videos in the playlist
// @access  Private
router.put("/:id/toggle_video", (request, response) => {
    const playlistId = request.params.id;
    const video_id = request.body.videoId;

    Video.findOne({ videoId: video_id }).exec(async (err, foundVideo) => {
        var video = foundVideo;
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
                            response.status(303).json({
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
            console.log("video", video);
        }
        Playlist.findById({ _id: playlistId }).exec((err, playlist) => {
            if (isEmpty(playlist)) {
                response.status(500).json({
                    playlistNotFound: `No playlist with id ${playlistId} found!`,
                    Error: err
                });
                return;
            }
            let check = playlist.videos.some(doc => {
                return doc.equals(video._id);
            });
            if (!check) {
                playlist.videos.unshift(video);
                playlist.save();
                response.status(200).json({
                    videoAddedToPlaylist: `Video was added to playlist ${
                        playlist.name
                    }`,
                    Playlist: playlist
                });
            } else {
                playlist.videos.splice(playlist.videos.indexOf(video), 1);
                playlist.save();
                response.status(200).json({
                    videoAddedToPlaylist: `Video was removed from playlist ${
                        playlist.name
                    }`,
                    Playlist: playlist
                });
            }
        });
    });
});

// @Route   Delete api/playlists
// @Desc    Deletes a playlist from the database by id
// @access  Private
router.delete("/:id", (req, response) => {
    Playlist.findByIdAndDelete({ _id: req.params.id }).exec((err, res) => {
        if (err) response.json(err);
        if (!err) response.json(res);
    });
});

module.exports = router;
