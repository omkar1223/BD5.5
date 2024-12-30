const express = require("express");
const { resolve } = require("path");
let { track } = require("./models/track.model");
let { sequelize } = require("./lib/index");
let { user } = require("./models/user.model");
let { like } = require("./models/like.model");
let { Op } = require("@sequelize/core");
const app = express();
const port = 3000;
let cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("static"));

let moviedata = [
  {
    name: "Raabta",
    genere: "Romantic",
    release_year: 2012,
    artist: "Arjit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genere: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghooaar",
    genere: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmavaat",
    duration: 3,
  },
  {
    name: "First Class",
    genere: "Dance",
    release_year: 2019,
    artist: "Arjit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Tittle Track",
    genere: "Romantic",
    release_year: 2019,
    artist: "Arjit Singh",
    album: "Kalank",
    duration: 5,
  },
];

app.get("/seedDB", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.create({
      username: "Akash",
      email: "akash@gmail.com",
      password: "test@1234",
    });

    await track.bulkCreate(moviedata);

    res.status(200).json({ message: "Data seeding sucussfull" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});

app.get("/tracks", async (req, res) => {
  const response = await track.findAll();
  res.status(200).json(response);
});

app.get("/users", async (req, res) => {
  const response = await user.findAll();
  res.status(200).json(response);
});

async function likeTrack(data) {
  const result = await like.create({
    userId: data.userId,
    trackId: data.trackId,
  });

  return { message: "Like added sucessfully", result };
}

app.get("/users/:id/like", async (req, res) => {
  const userId = parseInt(req.params.id);
  const trackId = parseInt(req.query.trackId);

  try {
    const response = await likeTrack({ userId, trackId });

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function dislikeTrack(data) {
  const dislikeData = await like.destroy({
    where: {
      userId: data.userId,
      trackId: data.trackId,
    },
  });

  if (dislikeData === 0) return {};

  return { message: "Disliked data sucessfully" };
}

app.get("/users/:id/dislike", async (req, res) => {
  const userId = parseInt(req.params.id);
  const trackId = parseInt(req.query.trackId);
  try {
    const response = await dislikeTrack({ userId, trackId });
    if (!response.message) {
      return res.status(404).json({ message: "No track found" });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/likes", async (req, res) => {
  const result = await like.findAll();
  res.status(200).json({ likes: result });
});
