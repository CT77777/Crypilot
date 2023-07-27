import client, { Connection, Channel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const rabbitMqClient: Connection = await client.connect(
  `amqps://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@cougar.rmq.cloudamqp.com/nusunbji`
);

export const channel: Channel = await rabbitMqClient.createChannel();

export async function assertQueues(channel: Channel) {
  await channel.assertQueue("buyEth_Queue", { durable: true });
  console.log(`buyEth_Queue active...`);

  await channel.assertQueue("swapEthToErc20_Queue", { durable: true });
  console.log(`swapEthToErc20_Queue active...`);

  await channel.assertQueue("swapErc20ToEth_Queue", { durable: true });
  console.log(`swapErc20ToEth_Queue active...`);
}
