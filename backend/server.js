// Referenced: https://www.youtube.com/watch?v=5CFafWpWwxo&t=694s

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const config = require("./config.js");

const PORT = process.env.PORT || 5000;

// Routes
const collection = require("./routes/collection.js");
const companies = require("./routes/companies.js");
const games = require("./routes/games.js");
const reviews = require("./routes/reviews.js");
const signin = require("./routes/signin.js");
const signup = require("./routes/signup.js");
const users = require("./routes/users.js");

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/collection", collection);
app.use("/api/companies", companies);
app.use("/api/games", games);
app.use("/api/reviews", reviews);
app.use("/api/signin", signin);
app.use("/api/signup", signup);
app.use("/api/users", users);

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await mongoose.connect(config.atlasURI).then(() => console.log("Connected to database")).catch((err) => console.log(err));
});
