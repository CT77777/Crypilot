import client, { Connection, Channel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const rabbitMqClient: Connection = await client.connect(
  `amqps://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@cougar.rmq.cloudamqp.com/nusunbji`
);

const channel: Channel = await rabbitMqClient.createChannel();

async function producer(channel: Channel) {
  for (let i = 0; i < 20; i++) {
    channel.sendToQueue("MyQueue1", Buffer.from(`task${i}`));
  }
  return;
}

producer(channel);

console.log("done");
