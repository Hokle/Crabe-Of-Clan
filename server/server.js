const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const image = path.join(__dirname, "public");
app.use("/image", express.static(image));

app.get("/random-image", (req, res) => {
  fs.readdir(image, (error, files) => {
    if (error) return res.status(404).send({ message: "Image not found" });
    const rdm = Math.floor(Math.random() * files.length);
    const img = files[rdm];
    return res.send({ image: img });
  });
});

app.listen(3000, () => {
  console.log(`[OK] : Le server fonctionne bien sur le port 3000`);
});
