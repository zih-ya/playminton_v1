import { Router } from "express";
import { UserModel, GameModel, AnnouncementModel } from "../models/Info";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// 處理 register
router.post("/users", (req, res) => {
  const { email, password, name } = req.body;
  console.log("name:", name);

  // 確認 email 是否已經註冊過了
  UserModel.findOne({ email }, (err, data) => {
    if (data) {
      res.send({ status: false, msg: "User already exist" });
    } else {
      const newUser = new UserModel({ email, password, name });
      newUser.save();
      res.send({ status: true, msg: "Create user" });
    }
  });
});

// 處理 login
router.get("/users", (req, res) => {
  const { email, password } = req.query;
  UserModel.findOne({ email, password }, (err, data) => {
    if (data) {
      res.json({ exist: true, msg: "Successfully logged in", name: data.name });
    } else {
      res.json({
        exist: false,
        msg: "Invalid email or password",
        name: null,
      });
    }
  });
});

// Update name
router.post("/users/name", (req, res) => {
  const { email, name } = req.body;
  if (name === "") {
    res.send({ status: false, msg: "Please enter a valid name" });
    return;
  }

  UserModel.updateOne({ email }, { name }, (err) => {
    if (err) {
      res.send({ status: false, msg: "Invalid update" });
    } else {
      res.send({ status: true, msg: "Successfully update" });
    }
  });
});

// Update password
router.post("/users/password", (req, res) => {
  const { email, newPassword, oldPassword } = req.body;

  // 確認舊密碼是否輸入正確
  UserModel.findOne({ email }, (err, data) => {
    if (data.password !== oldPassword) {
      res.send({ status: false, msg: "Incorrect password" });
      return;
    } else {
      UserModel.updateOne(
        { email },
        { password: newPassword },
        () => {
          res.send({ status: true, msg: "Successfully updated your password" });
        }
      );
    }
  });
});

// build events (應該不需要檢查重複？)
router.post("/events", (req, res) => {
  const { dateString, startTime, endTime, place, people, notes, host } =
    req.body;
  const newGame = new GameModel({
    id: uuidv4(),
    date: dateString,
    startTime,
    endTime,
    place,
    host,
    participants: [host],
    numberLeft: people,
    notes,
  });
  newGame.save();
  res.send({ msg: "Create event" });
});

// get events
router.get("/games", async (req, res) => {
  const isFuture = req.query.isFuture;
  const Games = await GameModel.find();
  let games = Games.filter((game) => {
    let today = new Date();
    
    // You can also use the following for "let day = ..."
    // const today = new Date().toLocaleDateString("zh-CN");
    let day =
      today.getFullYear() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getDate();
      
    if (JSON.parse(isFuture)) {
      let a = game.date > day;
      if (game.date.toString() === day.toString()) {
        let time = today.getHours() + ":" + today.getMinutes();
        a = game.startTime > time;
      }
      return a;
    } else {
      let a = game.date < day;
      if (game.date.toString() === day.toString()) {
        let time = today.getHours() + ":" + today.getMinutes();
        a = game.startTime < time;
      }
      return a;
    }
  });
  games = games.sort((a, b) => {
    if (a.date > b.date) return 1;
    else if (a.date < b.date) return -1;
    else if (a.startTime > b.startTime) return 1;
    else if (a.startTime < b.startTime) return -1;
    else if (a.endTime > b.endTime) return 1;
    else return -1;
  });
  for (let i = 0; i <= games.length - 1; i++) {
    let host = await UserModel.findOne({ email: games[i].host });
    host = host.name;
    games[i].host = host;
    for (let j = 0; j <= games[i].participants.length - 1; j++) {
      let name = await UserModel.findOne({ email: games[i].participants[j] });
      name = name.name;
      games[i].participants[j] = name;
    }
  }
  res.send(games);
});

// a person join
router.post("/join", async (req, res) => {
  const { id, email } = req.body;
  const newGame = await GameModel.findOne({ id });
  if (newGame.numberLeft > 0) {
    newGame.participants.push(email);
    newGame.participants.sort();
    newGame.numberLeft--;
    await newGame.save();
    res.send({ status: true, msg: "Join Success" });
  } else res.send({ status: false, msg: "Full Participants" });
});

// cancel one participant with this email
router.post("/cancel", async (req, res) => {
  const { id, email } = req.body;
  const newGame = await GameModel.findOne({ id });
  let n = true;
  newGame.participants = newGame.participants.filter((participant) => {
    if (participant === email && n) {
      n = false;
      return false;
    } else return true;
  });
  if (!n) {
    newGame.numberLeft = newGame.numberLeft + 1;
    await newGame.save();
    res.send({ status: true, msg: "Cancel Success" });
  } else res.send({ status: false, msg: "You aren't a participant" });
});

// get announcements
router.get("/announcements", async (req, res) => {
  const announcements = await AnnouncementModel.find();
  res.send(announcements);
});

// add announcement
router.post("/add", async (req, res) => {
  const { date, author, msg } = req.body;
  const newannouncement = new AnnouncementModel({
    id: uuidv4(),
    date,
    author,
    msg,
  });
  await newannouncement.save();
  res.send({ msg: "Add announcement" });
});

// delete announcement
router.post("/delete", async (req, res) => {
  const id = req.body.id;
  await AnnouncementModel.deleteOne({ id });
  res.send({ msg: "Delete announcement" });
});

export default router;
