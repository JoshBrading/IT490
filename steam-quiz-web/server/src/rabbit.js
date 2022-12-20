import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import config from "./config.json" assert { type : 'json' };  // Import the config file that holds the RabbitMQ connection details

class RabbitMQClient {
  constructor(machine, server = 'rabbitMQ') {
    // Assign the connection details from the config file to the instance variables
    this.BROKER_HOST = config.hostname;
    this.BROKER_PORT = config.port;
    this.USER = config.username;
    this.PASSWORD = config.password;
    this.VHOST = config.vhost;
    this.exchangeType = config.exchangeType || 'topic'; // Set the exchange type to 'topic' if it is not specified in the config
    this.autoDelete = false; // Set the auto delete flag to false
    this.exchange = config.exchange;
    this.queue = config.queue;
  }

  // The processResponse function is used to send a response message to a request
  async processResponse(response) {
    try {
      // Connect to the RabbitMQ server using the connection details
      const conn = await amqp.connect({
        hostname: this.BROKER_HOST,
        port: this.BROKER_PORT,
        username: this.USER,
        password: this.PASSWORD,
        vhost: this.VHOST,
      });
  
      // Create a channel for sending messages
      const channel = await conn.createChannel();
      
      // Assert the exchange specified in the config file
      const exchange = await channel.assertExchange(this.exchange, this.exchangeType);
      
      // Assert the queue specified in the config file
      const connQueue = await channel.assertQueue(this.queue, { autoDelete: this.autoDelete });
      //connQueue.bind(exchange.exchange, this.routingKey);
  
      // Publish the response message to the exchange with the specified routing key
      exchange.publish(JSON.stringify(response), this.routingKey);
      conn.close(); // Close the connection when the message has been sent
    } catch (error) {
      console.error(error);
    }
  }

  // The sendRequest function is used to send a request message and receive a response
  async sendRequest(request, responseExpected = true, routingKey = '*') {
    try {
      // Connect to the RabbitMQ server using the connection details
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
    add_acheivement: "add_achievement",
    get_acheivements: "get_achievements",
    user_update_achievements_public: "user_update_achievements_public",
    user_update_friends_public: "user_update_friends_public",
    user_update_profile_public: "user_update_profile_public",
    add_steam_games: "add_steam_games",
    add_game_pack: "add_game_pack",
    get_game_pack: "get_game_pack",
    get_game_packs: "get_game_packs",
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

//  await Rabbit.sendRequest({ type: 'ping'}).then((response) => {
//    console.log(response);
//  });
