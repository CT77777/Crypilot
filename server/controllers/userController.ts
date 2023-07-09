import { Request, Response } from "express";
import {
  insertUser,
  insetProvider,
  insertWallet,
  searchUserByEmail,
} from "../models/userModel.js";
import { getUserEthBalance } from "../models/walletModel.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/createJWT.js";
import { createWallet, encrypt } from "../utils/createWallet.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

// user register
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

      console.log(publicAddress);
      const { jwt, access_expired } = await createJWT(
        provider,
        user_id,
        email,
        username,
        picture,
        publicAddress
      );
      res.cookie("JWT", jwt);
      res.cookie("user_id", user_id);
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

// user log in
export async function logIn(req: Request, res: Response) {
  try {
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
        const publicAddress = `0x${public_address}`;
        const { jwt, access_expired } = await createJWT(
          "native",
          id,
          email,
          name,
          picture,
          publicAddress
        );
        res.cookie("JWT", jwt);
        res.cookie("user_id", id);
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

// render user profile page
export async function renderUserProfilePage(
  req: RequestWithPayload,
  res: Response
) {
  const { name, picture, public_address } = req.payload;

  const userEthBalance = await getUserEthBalance(public_address as string);

  const userInfo = {
    name: name,
    picture: "../images/hacker.png",
    public_address: public_address,
  };

  const data = {
    name: name,
    picture: "../images/hacker.png",
    public_address: public_address,
    userEthBalance: parseFloat(userEthBalance).toFixed(2),
    userInfo: userInfo,
  };

  res.status(200).render("profile", data);
}
