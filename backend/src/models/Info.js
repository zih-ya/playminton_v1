import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  name: String,
  password: String,
});
const UserModel = mongoose.model("user", UserSchema);

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
  msg: String
});
const AnnouncementModel = mongoose.model("announcement", AnnouncementSchema);

export { UserModel, GameModel, AnnouncementModel };
