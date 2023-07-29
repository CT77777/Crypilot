import { Request, Response } from "express";

//render home page
export function renderHomePage(req: Request, res: Response) {
  if (req.cookies.JWT) {
    res.redirect(302, "/user/profile");
  } else {
    res.status(200).render("home");
  }
}
