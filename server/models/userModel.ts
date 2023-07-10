import dbPool from "./dbPool.js";
import { OkPacket, RowDataPacket, FieldPacket } from "mysql2";

export async function insertUser(
  email: string,
  password: string,
  name: string,
  picture: string
) {
  const results: [OkPacket, FieldPacket[]] = await dbPool.query(
    `
        INSERT INTO users (email, password, name, picture)
        VALUES (?, ?, ?, ?)
    `,
    [email, password, name, picture]
  );
  const user_id = results[0].insertId;
  return user_id;
}

export async function insetProvider(user_id: number, name: string) {
  await dbPool.query(
    `
        INSERT INTO user_providers (user_id, name)
        VALUES (?, ?)
    `,
    [user_id, name]
  );
}

export async function insertWallet(
  user_id: number,
  public_address: string,
  private_key: string
) {
  await dbPool.query(
    `
        INSERT INTO user_wallets (user_id, public_address, private_key)
        VALUES (?, ?, ?)
    `,
    [user_id, public_address, private_key]
  );
}

export async function searchUserByEmail(email: string) {
  const results: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
        SELECT users.id, password, name, picture, public_address FROM users
        INNER JOIN user_wallets
        ON users.id = user_wallets.user_id
        WHERE email = ?
    `,
    [email]
  );

  return results[0][0];
}

// get user private key
export async function getPrivateKey(public_address: string) {
  const results: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
    SELECT private_key FROM user_wallets WHERE public_address = ?
  `,
    [public_address]
  );

  return results[0][0];
}

//delete user's secret key from DB
export async function removeUserPrivateKey(public_address: string) {
  try {
    await dbPool.query(
      `
      DELETE FROM user_wallets
      WHERE public_address = ?
    `,
      [public_address]
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//delete user's tracing FTs from DB
export async function removeAllFavoriteFT(user_id: number) {
  try {
    await dbPool.query(
      `
      DELETE FROM user_favorite_fts
      WHERE user_id = ?
    `,
      [user_id]
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//delete user's inventory FTs from DB
export async function removeAllInventoryFT(user_id: number) {
  try {
    await dbPool.query(
      `
      DELETE FROM user_inventory_fts
      WHERE user_id = ?
    `,
      [user_id]
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//delete user's provider from DB
export async function removeAllProvider(user_id: number) {
  try {
    await dbPool.query(
      `
      DELETE FROM user_providers
      WHERE user_id = ?
    `,
      [user_id]
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//delete user's information from DB
export async function removeUserInfo(user_id: number) {
  try {
    await dbPool.query(
      `
      DELETE FROM users
      WHERE id = ?
    `,
      [user_id]
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
