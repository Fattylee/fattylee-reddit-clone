import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Unauthenticated");
    const { username } = verify(token, process.env.JWT_SECRET) as any;
    const user = await User.findOne({ username });
    if (!user) throw new Error("Unauthenticated");
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
