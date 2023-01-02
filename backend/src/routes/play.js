import { Router } from "express";
import { UserModel, GameModel, AnnouncementModel } from "../models/Info";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../utils/email";

const router = Router();
class Session {
  constructor(email, expiresAt) {
      this.email = email;
      this.expiresAt = expiresAt;
  }
  isExpired() {
      this.expiresAt < new Date()
  }
}
const sessions = {};

router.get("/login", (req, res) => {
  const newsessionToken = req.query.session_token;
  let sessionToken = newsessionToken.slice(14);
  if(sessionToken)
  {
    let userSession = sessions[sessionToken]
    if(userSession)
    {
      if(userSession.isExpired())
      {
        delete sessions[sessionToken];
        res.send({ newme:"", newisLogin:false });
      }
      else res.send({ newme:userSession.email, newisLogin:true });
    }
    else res.send({ newme:"", newisLogin:false });
  }
  else res.send({ newme:"", newisLogin:false });
});

router.get("/logout", (req, res) => {
  const newsessionToken = req.query.session_token;
  let sessionToken = newsessionToken.slice(14);
  if(sessionToken)
  {
    delete sessions[sessionToken];
    res.send({ msg: "Logout Success", session_token: "", expires: new Date() });
  }
  else res.send({ msg: "Logout Falure" });
});

let token = 0;
const generateToken = () => {
  token = Math.random().toString(36).substring(2, 12);
};

// 處理 register
router.post("/user/register", (req, res) => {
  const { email } = req.body;

  // 確認 email 是否已經註冊過了
  UserModel.findOne({ email }, (err, data) => {
    if (data) {
      res.send({ status: false, msg: "User already exist" });
    } else {
      generateToken();
      sendMail({ email, token });
      res.send({
        status: true,
        msg: "Registration code has been sent to your email account",
      });
    }
  });
});

// to validate user's email
router.get("/user/validation", async (req, res) => {
  const { code, email, password, name } = req.query;
  if (code == token) {
    const newUser = new UserModel({ email, password, name });
    await newUser.save();
    res.json({ valid: true, msg: "Successfully registerd" });
  } else {
    res.json({ valid: false, msg: "Invalid registration code" });
  }
});

// 處理 login
router.get("/users", (req, res) => {
  const { email, password } = req.query;
  UserModel.findOne({ email, password }, (err, data) => {
    if (data) {
      const sessionToken = uuidv4();
      const now = new Date()
      const expiresAt = new Date(now + 360000);
      const session = new Session(email, expiresAt);
      sessions[sessionToken] = session;
      res.json({ exist: true, msg: "Successfully logged in", name: data.name, session_token: sessionToken, expires: expiresAt });
    } else {
      res.json({
        exist: false,
        msg: "Invalid email or password",
        name: null,
      });
    }
  });
});

// update avatar
router.post("/user/avatar", (req, res) => {
  const { email, preview } = req.body;
  UserModel.updateOne({ email }, { avatar: preview }, () => {
    res.send({ status: true, msg: "Successfully uploaded" });
  });
});

// update intro
router.post("/user/intro", (req, res) => {
  const { email, intro } = req.body;
  UserModel.updateOne({ email }, { intro }, () => {
    res.send({ status: true, msg: "Intro successfully uploaded" });
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
      UserModel.updateOne({ email }, { password: newPassword }, () => {
        res.send({ status: true, msg: "Successfully updated your password" });
      });
    }
  });
});

router.get("/users/profile", async (req, res) => {
  const { name, email } = req.query;
  if (name) var profile = await UserModel.findOne({ name });
  else var profile = await UserModel.findOne({ email });
  let newprofile = {
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar,
    intro: profile.intro,
  };
  res.send({ msg: "Get Profile", newprofile });
});

// build events (應該不需要檢查重複？)
router.post("/events", async(req, res) => {
  const { dateString, startTime, endTime, place, people, notes, host } =
    req.body;
  const user = await UserModel.findOne({email:host});
  const newGame = new GameModel({
    id: uuidv4(),
    date: dateString,
    startTime,
    endTime,
    place,
    host:{email:user.email, username:user.name},
    participants: [{email:user.email, username:user.name}],
    numberLeft: people,
    notes,
  });
  newGame.save();
  res.send({ msg: "Create event" });
});

const sort_games = (games) => {
  return games.sort((a, b) => {
    if (a.date > b.date) return 1;
    else if (a.date < b.date) return -1;
    else if (a.startTime > b.startTime) return 1;
    else if (a.startTime < b.startTime) return -1;
    else if (a.endTime > b.endTime) return 1;
    else return -1;
  });
};
// get events
router.get("/games", async (req, res) => {
  const isFuture = req.query.isFuture;
  const Games = await GameModel.find();
  let games = Games.filter((game) => {
    let today = new Date();
    // You can also use the following for "let day = ..."
    // const today = new Date().toLocaleDateString("zh-CN");
    let date = new Date(game.date + " " + game.startTime);
    if (JSON.parse(isFuture)) {
      return date > today;
    } else {
      return date < today;
    }
  });
  games = sort_games(games);
  res.send(games);
});

router.get("/games/user", async (req, res) => {
  const email = req.query.email;
  const Games = await GameModel.find();
  let games = Games.filter((game) => {
    return game.participants.some((participant) => {
      return participant.email === email;
    });
  });
  games = sort_games(games);
  res.send(games);
});

// a person join
router.post("/games/join", async (req, res) => {
  const { id, email } = req.body;
  const newGame = await GameModel.findOne({ id });
  const user = await UserModel.findOne({email});
  if (newGame.numberLeft > 0) {
    newGame.participants.push({email, username:user.name});
    newGame.numberLeft--;
    await newGame.save();
    res.send({ status: true, msg: "Join Success" });
  } else res.send({ status: false, msg: "Full Participants" });
});

// cancel one participant with this email
router.post("/games/cancel", async (req, res) => {
  const { id, email } = req.body;
  const newGame = await GameModel.findOne({ id });
  let n = true;
  newGame.participants = newGame.participants.filter((participant) => {
    if (participant.email === email && n) {
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
  let announcements = await AnnouncementModel.find();
  announcements = announcements.sort((a, b) => {
    if (a.date < b.date) return 1;
    else return -1;
  });
  for (let i = 0; i <= announcements.length - 1; i++) {
    announcements[i].date = announcements[i].date.slice(0, 10);
  }
  res.send(announcements);
});

// add announcement
router.post("/announcements/add", async (req, res) => {
  const { author, msg } = req.body;
  const newannouncement = new AnnouncementModel({
    id: uuidv4(),
    date: new Date().toISOString().split`-`.join`/`,
    author,
    msg,
  });
  await newannouncement.save();
  res.send({ msg: "Add announcement" });
});

// delete announcement
router.post("/announcements/delete", async (req, res) => {
  const id = req.body.id;
  await AnnouncementModel.deleteOne({ id });
  res.send({ msg: "Delete announcement" });
});

export default router;
