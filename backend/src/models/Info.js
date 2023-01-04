import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  name: String,
  password: String,
  avatar: String,
  intro: String,
});
const UserModel = mongoose.model("user", UserSchema);

const TokenSchema = new Schema({
  email: String,
  token: String,
});
const TokenModel = mongoose.model("token", TokenSchema);

const GameSchema = new Schema({
  id: String,
  date: String,
  startTime: String,
  endTime: String,
  place: String,
  host: String,
  participants: [String],
  numberLeft: Number,
  notes: String,
});
const GameModel = mongoose.model("game", GameSchema);

const AnnouncementSchema = new Schema({
  id: String,
  date: String,
  author: String,
  msg: String,
});
const AnnouncementModel = mongoose.model("announcement", AnnouncementSchema);

export { UserModel, TokenModel, GameModel, AnnouncementModel };
