import { Request, Response } from "express";
import {
  insertUser,
  insetProvider,
  insertWallet,
  createWallet,
  encrypt,
  searchUserByEmail,
} from "../models/userModel.js";

export function renderUserPage(req: Request, res: Response) {
  res.render("user");
}

export async function register(req: Request, res: Response) {
  try {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const picture = "https://cdn-icons-png.flaticon.com/128/6774/6774978.png";
    const provider = "native";
    const { privateKey, publicAddress } = createWallet();
    const encryptedPrivateKey = encrypt(privateKey);

    const user_id = await insertUser(email, password, username, picture);
    await insetProvider(user_id, provider);
    await insertWallet(user_id, publicAddress.slice(2), encryptedPrivateKey);

    res.status(200).json({ message: "register successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "register failed" });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    console.log(req.body);
    const email = req.body.email;
    const passwordInput = req.body.password;
    const { password, name, picture, public_address } = await searchUserByEmail(
      email
    );
    if (passwordInput === password) {
      res.status(200).redirect(`/user/profile?email=${email}`);
    } else {
      throw new Error("password not correct");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "signIn failed" });
  }
}

export async function renderUserProfilePage(req: Request, res: Response) {
  const email = `${req.query.email}`;
  const { name, picture, public_address } = await searchUserByEmail(email);
  const data = {
    name: name,
    picture: picture,
    public_address: `0x${public_address}`,
  };
  console.log(data);
  res.status(200).render("profile", data);
}
