import express from "express";
import path from "path";
import cors from "cors";
import routes from "./routes";
import db from "./db";

const app = express();

// if (process.env.NODE_ENV === "development") {
//   app.use(cors());
// }

app.use(cors());
app.use(express.json());
app.use("/", routes);
db.connect();

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
