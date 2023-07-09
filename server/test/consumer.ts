import client, { Connection, Channel } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const rabbitMqClient: Connection = await client.connect(
  `amqps://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@cougar.rmq.cloudamqp.com/nusunbji`
);

const channel: Channel = await rabbitMqClient.createChannel();

// await channel.deleteQueue("MyQueue1");

await channel.assertQueue("MyQueue1");

async function producer(channel: Channel) {
  for (let i = 0; i < 20; i++) {
    channel.sendToQueue("MyQueue1", Buffer.from(`task${i}`));
  }
  return;
}

async function consumer(channel: Channel) {
  const status = await new Promise((resolve, reject) => {
    channel.consume(
      "MyQueue1",
      (msg) => {
        if (msg) {
          const parsed = msg.content.toString();
          console.log(parsed);
        }
      },
      { noAck: true }
    );
  });

  return status;
}

// await producer(channel);

consumer(channel);
