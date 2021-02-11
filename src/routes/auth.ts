import { validate } from "class-validator";
import { Router } from "express";
import { User } from "../entity/User";

const router = Router();

router.get("/me", (_, res) => {
  res.json({ msg: "Hurray" });
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email, password });
    const errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(errors);

    const error: any = {};

    const usernameUser = await User.findOne({ where: { username } });
    const emailUser = await User.findOne({ where: { email } });

    console.log(emailUser, usernameUser);

    if (usernameUser) error.username = "Username already taken";
    if (emailUser) error.email = "Email already taken";

    if (Object.keys(error).length > 0) return res.status(400).json(error);

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).json(error);
  }
});
export const authRoute = router;
