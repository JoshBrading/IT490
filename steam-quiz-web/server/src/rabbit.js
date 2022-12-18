import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import config from "./config.json"assert { type : 'json' };

class RabbitMQClient {
  constructor(machine, server = 'rabbitMQ') {
    this.BROKER_HOST = config.hostname;
    this.BROKER_PORT = config.port;
    this.USER = config.username;
    this.PASSWORD = config.password;
    this.VHOST = config.vhost;
    this.exchangeType = config.exchangeType || 'topic';
    this.autoDelete = false;
    this.exchange = config.exchange;
    this.queue = config.queue;
  }

  async processResponse(response) {
    try {
      const conn = await amqp.connect({
        hostname: this.BROKER_HOST,
        port: this.BROKER_PORT,
        username: this.USER,
        password: this.PASSWORD,
        vhost: this.VHOST,
      });
  
      const channel = await conn.createChannel();
      const exchange = await channel.assertExchange(this.exchange, this.exchangeType);
      const connQueue = await channel.assertQueue(this.queue, { autoDelete: this.autoDelete });
      //connQueue.bind(exchange.exchange, this.routingKey);
  
      exchange.publish(JSON.stringify(response), this.routingKey);
      conn.close();
    } catch (error) {
      console.error(error);
    }
  }

  async sendRequest(request, responseExpected = true, routingKey = '*') {
    try {
      const conn = await amqp.connect({
        hostname: this.BROKER_HOST,
        port: this.BROKER_PORT,
        username: this.USER,
        password: this.PASSWORD,
        vhost: this.VHOST,
      });
  
      const channel = await conn.createChannel();
      const exchange = await channel.assertExchange(this.exchange, this.exchangeType);
  
      // Create an instance of the AMQPQueue class
      const connQueue = await channel.assertQueue(this.queue, { autoDelete: this.autoDelete });
  
      // Bind the queue to the exchange with the specified routing key
      //channel.bind(exchange.exchange, routingKey);
  
      // Send the request and wait for the response
      const correlationId = uuidv4();
      const response = await new Promise((resolve, reject) => {
        const options = {
          correlationId,
          replyTo: connQueue.queue,
        };
  
        // Send the request
        channel.publish(this.exchange, routingKey, Buffer.from(JSON.stringify(request)), options);
  
        if (!responseExpected) {
          conn.close();
          resolve();
        }
  
        // Wait for the response
        channel.consume("response_" + this.queue, (msg) => {
          //console.log(msg);
            if (msg.properties.correlationId === correlationId) {
              resolve(JSON.parse(msg.content.toString()));
              setImmediate(() => conn.close());
            }
          },
          { noAck: true }
        );
      });
  
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  
}

export const RabbitTypes = {
  user: {
    new_user: "new_user",
    login: "login",
    get_friends: "get_friends",
    get_user_data: "get_user_data",
    get_username_from_id: "get_username_from_id",
    get_account_id: "get_account_id",
    add_friend: "add_friend",
    add_acheivement: "add_acheivement",
    get_acheivements: "get_acheivements",
    user_update_achievements_public: "user_update_achievements_public",
    user_update_friends_public: "user_update_friends_public",
    user_update_profile_public: "user_update_profile_public"
  },
  game: {
    new_steam_game: "new_steam_game",
    get_steam_game: "get_steam_game",
    get_all_steam_games: "get_all_steam_games",
  },
  lobby: {
    lobby_add: "lobby_add",
    lobby_remove: "lobby_remove",
    lobby_update_status: "lobby_update_status",
    get_lobbies: "get_lobbies",
    update_stats: "update_stats"
  }
}

export const Rabbit = new RabbitMQClient();

await Rabbit.sendRequest({ type: 'ping'}).then((response) => {
  console.log(response);
});
