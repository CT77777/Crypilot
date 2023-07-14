import { Request, Response } from "express";
import {
  insertUser,
  insetProvider,
  insertWallet,
  searchUserByEmail,
  getPrivateKey,
  removeUserPrivateKey,
  removeAllFavoriteFT,
  removeAllInventoryFT,
  removeAllProvider,
  removeUserInfo,
  getSecondAuthenticationSecret,
  updateSecondAuthenticationSecret,
} from "../models/userModel.js";
import { getUserEthBalance } from "../models/walletModel.js";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/createJWT.js";
import { createWallet, encrypt } from "../utils/createWallet.js";
import { JWTPayload } from "jose";
import { decrypt } from "../utils/createWallet.js";
import { generateSecret, generateQRcode, verifyToken } from "../utils/2FA.js";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

// user register
export async function register(req: Request, res: Response) {
  try {
    const { email, password, username } = req.body;
    const picture = "https://cdn-icons-png.flaticon.com/128/6774/6774978.png";
    const provider = "native";
    const userInfo = await searchUserByEmail(email);

    if (userInfo === undefined) {
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
      const { jwt } = await createJWT(
        provider,
        user_id,
        email,
        username,
        picture,
        publicAddress,
        false
      );
      res.cookie("JWT", jwt, { maxAge: 2 * 60 * 60 * 1000 });
      // res.cookie("user_id", user_id);
      res.status(200).redirect(`/user/profile?email=${email}`);

      return;
    } else {
      res.status(400).json({
        error: { message: "This email has already been registered!" },
      });

      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: { message: "Something wrong on server side" },
    });
  }
}

// user log in
export async function logIn(req: Request, res: Response) {
  try {
    const { email: email, password: passwordInput } = req.body.data;
    const userInfo = await searchUserByEmail(email);

    if (userInfo === undefined) {
      res
        .status(400)
        .json({ error: { message: "This email hasn't been registered!" } });

      return;
    } else {
      const {
        id,
        password,
        name,
        picture,
        public_address,
        second_authentication_secret,
      } = userInfo;

      const compare = await new Promise((resolve, reject) => {
        bcrypt.compare(passwordInput, password, (err, result) => {
          resolve(result);
        });
      });

      if (compare && second_authentication_secret !== null) {
        res.status(200).json({ data: { second_FA: true } });

        return;
      } else if (compare === false) {
        res.status(400).json({ error: { message: "Password not correct" } });

        return;
      } else if (second_authentication_secret === null) {
        const publicAddress = `0x${public_address}`;
        const { jwt } = await createJWT(
          "native",
          id,
          email,
          name,
          picture,
          publicAddress,
          false
        );
        res.cookie("JWT", jwt, { maxAge: 2 * 60 * 60 * 1000 });
        // res.cookie("user_id", id);
        res
          .status(200)
          .json({ data: { redirect: `/user/profile?email=${email}` } });

        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: { message: "Something wrong on server side" },
    });
  }
}

// user 2fa set up
export async function setSecondAuthentication(
  req: RequestWithPayload,
  res: Response
) {
  try {
    const { email } = req.payload;
    const { second_authentication_secret: secret, error: error } =
      await getSecondAuthenticationSecret(email as string);

    if (error) {
      throw new Error("interact with DB failed");
    }

    if (secret !== null) {
      res.status(400).json({ error: { message: "Already set up 2FA" } });
      return;
    }

    const newSecret = generateSecret();
    const newSecretASCII = newSecret.ascii;

    await updateSecondAuthenticationSecret(newSecretASCII, email as string);

    const newQRcode = await generateQRcode(newSecret);

    res.status(200).json({ data: { QRcode: newQRcode } });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: { message: "something go wrong when server setting up 2FA" },
    });
  }
}

// user 2fa verify
export async function verifySecondAuthentication(req: Request, res: Response) {
  try {
    const { email, token } = req.body.data;
    const {
      id,
      name,
      picture,
      public_address,
      second_authentication_secret: secret,
    } = await searchUserByEmail(email);

    if (secret === null || secret === undefined) {
      res.status(400).json({ error: { message: "Haven't set up 2FA" } });
      return;
    }

    const isVerified = await verifyToken(secret, "ascii", token);

    if (isVerified) {
      const publicAddress = `0x${public_address}`;
      const { jwt } = await createJWT(
        "native",
        id,
        email,
        name,
        picture,
        publicAddress,
        isVerified
      );
      res.cookie("JWT", jwt, { maxAge: 2 * 60 * 60 * 1000 });
      // res.cookie("user_id", id);
      res
        .status(200)
        .json({ data: { redirect: `/user/profile?email=${email}` } });

      return;
    } else {
      res.status(400).json({ error: { message: "Not valid token" } });

      return;
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: { message: "something go wrong when server verifies token" },
    });
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

// retrieve user's secret key
export async function retrievePrivateKey(
  req: RequestWithPayload,
  res: Response
) {
  try {
    const { public_address: userWalletAddress, id: userId } = req.payload;

    const { private_key: encryptedPrivateKey } = await getPrivateKey(
      (userWalletAddress as string).slice(2)
    );

    if (encryptedPrivateKey === "0") {
      throw new Error("interact with DB failed");
    }

    //decrypt
    const private_key = decrypt(encryptedPrivateKey);
    console.log(private_key);

    //delete user's tracing FTs from DB
    const isRemovedFavoriteFts = await removeAllFavoriteFT(userId as number);
    if (!isRemovedFavoriteFts) {
      throw new Error();
    }

    //delete user's inventory FTs from DB
    const isRemovedInventoryFts = await removeAllInventoryFT(userId as number);
    if (!isRemovedInventoryFts) {
      throw new Error();
    }

    const isRemovedUserProviders = removeAllProvider(userId as number);
    if (!isRemovedUserProviders) {
      throw new Error();
    }

    //delete user's secret key from DB
    const isRemovedPrivateKey = await removeUserPrivateKey(
      (userWalletAddress as string).slice(2)
    );
    if (!isRemovedPrivateKey) {
      throw new Error();
    }

    //delete user's information from DB
    const isRemovedUserInfo = await removeUserInfo(userId as number);
    if (!isRemovedUserInfo) {
      throw new Error();
    }

    res.status(200).json({ success: true, private_key });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Retrieve private key failed",
      error: (error as Error).message,
    });
  }
}
