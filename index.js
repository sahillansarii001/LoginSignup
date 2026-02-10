import express from "express";
import mongoose from "mongoose";
import User from "./model/user.model.js";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/login")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello Client");
  res.end();
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);

  const adduser = await User({ username, email, password: hashpassword });
  await adduser.save();

  res.json({ message: "user register Succesfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const checkmail = await User.findOne({ email });

  if (!checkmail) return res.json({ message: "invalid email" });

  const comparepassword = await bcrypt.compare(password, checkmail.password);

  if (!comparepassword) return res.json({ message: "invalid password" });

//   if (password === checkmail.password) {
//     res.json({ message: "login successfull" });
//   } else {
//     res.json({ message: "invalid password" });
//   }
});
app.listen(3000, () => {
  console.log("server is running..");
});
