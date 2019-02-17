const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const playlists_apis_routes = require("./routes/api/playlist");
const { mongoURI } = require("./config/keys");
const app = express();

// @Middleware  bodyParser middleware
app.use(bodyParser.json());

// @ORM     mongoose orm
// @Desc    Connects the application to the database
// @Databse Mongo Atlas -> Amazon Web Services
mongoose
    .connect(mongoURI)
    .then(() => console.log("db conected ........"))
    .catch(err => console.log("err", err));

// @Middleware  Playlists endpoints middleware
// @Desc        Redirects playlits requests to playlists apis folder
app.use("/api/playlists", playlists_apis_routes);

// @Port    Server connection port
// @Desc    Looks for defined port number in environment else uses 5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server connected on port ${port}`));
