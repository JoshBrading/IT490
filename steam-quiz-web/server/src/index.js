import express from "express";
import session from "express-session";
import passport from "passport";
import passprtSteam from "passport-steam";
import cors from "cors";
import { StreamChat } from "stream-chat";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import "./game.js";
import { Rabbit, RabbitTypes } from "./rabbit.js";

var SteamStrategy = passprtSteam.Strategy;

const app = express();

// app.use(cors({    origin: ["*", "localhost:5173"],    methods: [
// "GET", "POST"    ] }));

app.use(express.json());
app.use(
  session({
    secret: "d31c51f4-687b-4ff3-a31f-ce96f47c88bd",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const api_key = "pv5nh9adqmbd";
const api_secret =
  "99udkqms5uteg7ccdac53cu4rq7wfbmwe3sgqp74q5hzszt3s5cz2jq7dqs664qa";

const serverClient = StreamChat.getInstance(api_key, api_secret);

// Required to get data from user for sessions
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
// Initiate Strategy
passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:" + 3001 + "/api/auth/steam/return",
      realm: "http://localhost:" + 3001 + "/",
      apiKey: "7E93DCA49A64743A0B3815833308A199",
    },
    function (identifier, profile, done) {
      // Remove the call to process.nextTick
      return done(null, profile);
    }
  )
);

app.use(
  session({
    secret: "d31c51f4-687b-4ff3-a31f-ce96f47c88bd",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/auth/steam", passport.authenticate("steam"), (req, res) => {
  // Return user data as JSON
  res.json(req.user);
});
app.get(
  "/api/auth/steam/return",
  passport.authenticate("steam", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { user: req.user },
      "d31c51f4-687b-4ff3-a31f-ce96f47c88bd",
      {
        expiresIn: "2h",
      }
    );

    // Send a message to the frontend after authenticating
    res.redirect(`http://localhost:5173?success=true&token=${token}`);
  }
);
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  // res.json({ username, hashedPassword });
  var data = {
    type: "new_user",
    username: username,
    password: hashedPassword,
  };

  Rabbit.sendRequest(data).then((response) => {
    console.log(response);
    if (response == "succ") {
      res.json({ username, status: "success" });
    }
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  res.json({ success: true, username, id: "2525" });
  return;
  //res.json({ username, hashedPassword })
  console.log(req.body);
  var data = {
    type: "login",
    username: username,
  };
  Rabbit.sendRequest(data).then((response) => {
    console.log(Object.entries(response));
    if (response["hash"] == null) {
      res.json({ success: false });
      return;
    }

    if (bcrypt.compareSync(password, response["hash"])) {
      console.log("Authenticated with ID: " + response["id"]);
      req.session.loggedIn = true;
      req.session.username = username;
      req.session.password = password;
      res.json({ success: true, username, id: response["id"] });
    } else {
      res.json({ success: false });
    }
  });
});

app.get("/game", async (req, res) => {
  if (req.session.loggedIn) {
    // The user is logged in, so you can access their session values
    const username = req.session.username;
    const password = req.session.password;
  } else {
    // The user is not logged in, so redirect them to the login page
    res.redirect("/login");
  }
});

app.post("/api/userRequest", async (req, res) => {
  const { request, username } = req.body;
  console.log(request, RabbitTypes.user.get_game_packs);
  switch (request) {
    case RabbitTypes.user.get_user_data:
      res.json({
        success: true,
        profile: {
          username: "test",
          friends: ["friend1", "friend2", "friend3", "friend4", "friend5"],
          achievements: ["ach1", "ach2", "ach3", "ach4", "ach5"],
          packs: ["pack1", "pack2", "pack3", "pack4", "pack5"],
        },
      });
    case RabbitTypes.user.get_friends:
      res.json({
        success: true,
        friends: ["friend1", "friend2", "friend3", "friend4", "friend5"],
      });
      break;
    case RabbitTypes.user.add_friend:
      res.json({ success: true });
      break;
    case RabbitTypes.user.get_achievements:
      res.json({
        success: true,
        achievements: ["ach1", "ach2", "ach3", "ach4", "ach5"],
      });
      break;
    case RabbitTypes.user.add_achievement:
      res.json({ success: true });
      break;
    case RabbitTypes.user.add_steam_games:
      res.json({ success: true });
      break;
    case RabbitTypes.user.add_game_pack:
      res.json({ success: true });
      break;
    case RabbitTypes.user.get_game_pack:
      res.json({
          success: true,
          pack: ["game1", "game2", "game3", "game4", "game5"],
        }
      );
      break;
    case RabbitTypes.user.get_game_packs:
      res.json({
        success: true,
        packs: ["pack1", "pack2", "pack3"],
      });
      break;
    default:
      res.json({ success: false, error: "Invalid request" });
  }
});

app.post("/api/gameRequest", async (req, res) => {
  const { request, game } = req.body;
  console.log(request, RabbitTypes.game.get_all_steam_games);
  switch (request) {
    case RabbitTypes.game.get_all_steam_games:
      Rabbit.sendRequest({ type: RabbitTypes.game.get_all_steam_games }).then(
        (response) => {
          console.log(JSON.parse(response));
          const game_details = JSON.parse(response);
          res.json({ success: true, games: game_details });
        }
      );
      break;
    default:
      res.json({ success: false, error: "Invalid request" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
