import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/createJWT.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authentication = req.headers.Authentication;
  const { JWT } = req.cookies;

  if (authentication) {
    const jwt = (authentication as string).split(" ")[1];

    try {
      const payload = await verifyJWT(jwt);
      res.locals.payload = payload;

      next();
    } catch (error) {
      console.log(error);

      res.status(403).json({
        error: {
          message: "authenticate failed",
        },
      });
    }
  } else if (JWT) {
    const jwt = JWT;

    try {
      const payload = await verifyJWT(jwt);
      res.locals.payload = payload;

      next();
    } catch (error) {
      console.log(error);

      res.render("home");
    }
  } else {
    res.redirect("/");
  }
}
