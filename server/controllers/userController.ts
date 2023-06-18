import { Request, Response } from "express";

export function renderUserPage(req: Request, res: Response) {
  res.render("user");
}

export function register(req: Request, res: Response) {
  try {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    res.send(email);
  } catch (error) {
    console.log(error);
  }
}
