const express = require("express");
const router = express.Router();

// @Import  Imports the Playlist schema from models
const Playlist = require("../../models/playlists_schema");

// @Route   Get api/playlists/test
// @Desc    Tests if this api endpoint is working
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Playlists Works" }));

// @Route   Get api/playlists
// @Desc    Gets a list of all playlists
// @access  Public
router.get("/", (req, res) => {
    Playlist.find()
        .sort({ lastUpdated: -1 })
        .then(items => res.json(items))
        .catch(error => console.log("error", error));
});

// @Route   Post api/playlists
// @Desc    Posts a new playlist to the database
// @access  Public
router.post("/", (req, res) => {
    const newPlaylist = new Playlist({
        name: req.body.name
    });

    console.log(req.body);

    newPlaylist
        .save()
        .then(playlist => res.json(playlist))
        .catch(err => console.log(err));
    // res.json(newPlaylist)
});

module.exports = router;
