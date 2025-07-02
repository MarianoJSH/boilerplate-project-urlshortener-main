require("dotenv").config();
const validUrl = require("valid-url");
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const urlDatabase = {};
let shortUrlCounter = 0; 

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  let existingShortUrl = null;
  for (const short in urlDatabase) {
    if (urlDatabase[short] === originalUrl) {
      existingShortUrl = parseInt(short);
      break;
    }
  }

  if (existingShortUrl != null) {
    return res.json({
      original_url: originalUrl,
      short_url: existingShortUrl,
    });
  } else {
    shortUrlCounter++;
    urlDatabase[shortUrlCounter] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrlCounter,
    });
  }
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  if (isNaN(shortUrl) || !urlDatabase[shortUrl]) {
    return res.json({ error: "No se ha encontrado esa URL" });
  }

  const originalUrl = urlDatabase[shortUrl];

  res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
