import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/createJWT.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

export async function authenticate(
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) {
  const authentication = req.headers.Authentication;
  const JWT = req.cookies.JWT;
  if (authentication) {
    const jwt = (authentication as string).split(" ")[1];
    try {
      const payload = await verifyJWT(jwt);
      req.payload = payload;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({
        message: "authenticate failed",
        error: (error as Error).message,
      });
    }
  } else if (JWT) {
    try {
      const jwt = JWT;
      const payload = await verifyJWT(jwt);
      req.payload = payload;
      next();
    } catch (error) {
      console.log(error);
      res.redirect("/");
      // res.status(403).json({
      //   message: "authenticate failed",
      //   error: (error as Error).message,
      // });
    }
  } else {
    const errorMessage = new Error("Haven't logged in");
    res.redirect("/");
    // res
    //   .status(401)
    //   .json({ message: "authenticate failed", error: errorMessage.message });
  }
}
