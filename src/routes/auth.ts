import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { User } from "../entity/User";
import auth from "../middlewares/auth";

const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email, password });
    const errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(errors);

    const error: any = {};

    const usernameUser = await User.findOne({ username });
    const emailUser = await User.findOne({ email });

    console.log(emailUser, usernameUser);

    if (usernameUser) error.username = "Username already taken";
    if (emailUser) error.email = "Email already taken";

    if (Object.keys(error).length > 0) return res.status(400).json(error);

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const errors: any = {};

    if (isEmpty(username)) errors.username = "Username can not be empty";
    if (isEmpty(password)) errors.password = "Password can not be empty";

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ username: "Username name not found" });

    if (!(await user.isValidPassword(password)))
      return res.status(401).json({ password: "Invalid password" });

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // cant be accessed by javascript
        secure: process.env.NODE_ENV === "production", // from https domain or not
        path: "/", // to be available everywhere on our domain
        sameSite: "strict",
        maxAge: 60 * 60,
      })
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

const me = async (req: Request, res: Response) => {
  res.json(res.locals.user);
};

const logout = (req: Request, res: Response) => {
  res.set(
    "set-cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      expires: new Date(0),
    })
  );
  res.json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/logout", auth, logout);

export const authRoute = router;
