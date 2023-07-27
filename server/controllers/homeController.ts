import { Request, Response } from "express";

//render home page
export function renderHomePage(req: Request, res: Response) {
  if (req.cookies.JWT) {
    res.redirect("/user/profile");
  } else {
    res.render("home");
  }
}
