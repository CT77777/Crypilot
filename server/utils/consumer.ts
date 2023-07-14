import client, { Connection, Channel } from "amqplib";
import {
  sendETH,
  swapEthToToken,
  swapTokenToEth,
  getPrivateKey,
  insertInventoryFt,
} from "../models/tradeModel.js";
import { decrypt } from "./createWallet.js";
import dotenv from "dotenv";
import { io } from "socket.io-client";

dotenv.config();

// connect socket
const socket = io("wss://localhost:8080", {
  rejectUnauthorized: false,
});

socket.on("connect", function () {
  console.log("Consumer connects to socket server...");
});

socket.on("connect_error", function (err) {
  console.log(err);
});

const rabbitMqClient: Connection = await client.connect(
  `amqps://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@cougar.rmq.cloudamqp.com/nusunbji`
);

const channel: Channel = await rabbitMqClient.createChannel();

if (channel) {
  console.log(`Consumer connects to RabbitMQ...`);
}

async function consumerBuyEth(channel: Channel) {
  channel.consume(
    "buyEth_Queue",
    async (task) => {
      if (task) {
        const parsedTask = JSON.parse(task.content.toString());
        console.log(parsedTask);
        const { userId, userWalletAddress, ethAmount } = parsedTask.data;

        try {
          const isSuccessful = await sendETH(
            userWalletAddress as string,
            ethAmount
          );

          if (isSuccessful) {
            await insertInventoryFt("", userId as number);

            const txResult = { success: true, token: "ETH", amount: ethAmount };
            socket.emit("buyEthStatus", txResult, userId);
          } else {
            const txResult = {
              success: false,
              token: "ETH",
              amount: ethAmount,
            };
            socket.emit("buyEthStatus", txResult, userId);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    { noAck: true }
  );

  return;
}

async function consumerSwapEthToErc20(channel: Channel) {
  channel.consume(
    "swapEthToErc20_Queue",
    async (task) => {
      if (task) {
        const parsedTask = JSON.parse(task.content.toString());
        console.log(parsedTask);

        const {
          userId,
          userWalletAddress,
          tokenAddress,
          tokenAmount,
          tokenSymbol,
          tokenCmcId,
        } = parsedTask.data;

        try {
          //get encrypted private key from DB
          const { private_key: encryptedPrivateKey } = await getPrivateKey(
            (userWalletAddress as string).slice(2)
          );

          //decrypt
          const private_key = decrypt(encryptedPrivateKey);

          const isSuccessful = await swapEthToToken(
            tokenAddress,
            tokenAmount,
            private_key,
            userWalletAddress as string
          );

          if (isSuccessful) {
            await insertInventoryFt(tokenAddress, userId as number);
            const txResult = {
              success: true,
              token: tokenSymbol,
              amount: tokenAmount,
              id: tokenCmcId,
            };
            socket.emit("swapEthToStatus", txResult, userId);
          } else {
            const txResult = {
              success: false,
              token: tokenSymbol,
              amount: tokenAmount,
              id: tokenCmcId,
            };
            socket.emit("swapEthToStatus", txResult, userId);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    { noAck: true }
  );

  return;
}

async function consumerSwapErc20ToEth(channel: Channel) {
  const status = await new Promise((resolve, reject) => {
    channel.consume(
      "swapErc20ToEth_Queue",
      async (task) => {
        if (task) {
          const parsedTask = JSON.parse(task.content.toString());
          console.log(parsedTask);

          const {
            userId,
            userWalletAddress,
            tokenAddress,
            tokenAmount,
            tokenSymbol,
            tokenCmcId,
          } = parsedTask.data;

          try {
            //get encrypted private key from DB
            const { private_key: encryptedPrivateKey } = await getPrivateKey(
              (userWalletAddress as string).slice(2)
            );

            //decrypt
            const private_key = decrypt(encryptedPrivateKey);

            const isSuccessful = await swapTokenToEth(
              tokenAddress,
              tokenAmount,
              private_key,
              userWalletAddress as string
            );

            if (isSuccessful) {
              const txResult = {
                success: true,
                token: tokenSymbol,
                amount: tokenAmount,
                id: tokenCmcId,
              };
              socket.emit("swapTokenToStatus", txResult, userId);
            } else {
              const txResult = {
                success: false,
                token: tokenSymbol,
                amount: tokenAmount,
                id: tokenCmcId,
              };
              socket.emit("swapTokenToStatus", txResult, userId);
            }
          } catch (error) {
            console.log(error);
          }
        }
      },
      { noAck: true }
    );
  });

  return status;
}

consumerBuyEth(channel);
consumerSwapEthToErc20(channel);
consumerSwapErc20ToEth(channel);
