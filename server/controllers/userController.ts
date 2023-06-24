import { Request, Response } from "express";
import {
  insertUser,
  insetProvider,
  insertWallet,
  searchUserByEmail,
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/createJWT.js";
import { createWallet, encrypt } from "../utils/createWallet.js";

export function renderUserPage(req: Request, res: Response) {
  res.render("user");
}

export async function register(req: Request, res: Response) {
  try {
    console.log(req.body);
    const { email, password, username } = req.body;
    const picture = "https://cdn-icons-png.flaticon.com/128/6774/6774978.png";
    const provider = "native";
    const user = await searchUserByEmail(email);
    if (user === undefined) {
      const saltRounds = 7;
      const passwordHash = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          resolve(hash);
        });
      });

      const { privateKey, publicAddress } = createWallet();
      const encryptedPrivateKey = encrypt(privateKey);

      const user_id = await insertUser(
        email,
        passwordHash as string,
        username,
        picture
      );
      await insetProvider(user_id, provider);
      await insertWallet(user_id, publicAddress.slice(2), encryptedPrivateKey);

      const { jwt, access_expired } = await createJWT(
        provider,
        user_id,
        email,
        username,
        picture,
        publicAddress
      );
      res.cookie("JWT", jwt);
      res.status(200).redirect(`/user/profile?email=${email}`);
    } else {
      throw new Error("This email has already been registered!");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "register failed", error: (error as Error).message });
  }
}

export async function logIn(req: Request, res: Response) {
  try {
    console.log(req.body);
    const { email: email, password: passwordInput } = req.body;
    const { id, password, name, picture, public_address } =
      await searchUserByEmail(email);
    if (id === undefined) {
      throw Error("This email hasn't been registered!");
    } else {
      const compare = await new Promise((resolve, reject) => {
        bcrypt.compare(passwordInput, password, (err, result) => {
          resolve(result);
        });
      });

      if (compare) {
        const { jwt, access_expired } = await createJWT(
          "native",
          id,
          email,
          name,
          picture,
          public_address
        );
        res.cookie("JWT", jwt);
        res.status(200).redirect(`/user/profile?email=${email}`);
      } else {
        throw new Error("password not correct");
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Login failed", error: (error as Error).message });
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
