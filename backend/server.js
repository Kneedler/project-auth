import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://spacecake:${process.env.STRING_PW}@cluster0.jgvyhjl.mongodb.net/projectAuth?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// shows error if the server is not responding
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

//Schemas
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
/*   email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
      },
      message: "Please enter a valid email address"
    }
  }, */
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
});

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  hearts: {
    type: Number,
    default: 0
  }
});

// models
const User = mongoose.model("User", UserSchema)
const Thought = mongoose.model("Thought", ThoughtSchema)

// authentication 
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Athorization");
  try {
    const user = await User.findOne({accessToken: accessToken});
    if (user) {
      next()
    } else {
      res.status(401).json({
        success: false,
        response: "Please log in"
      })//401 unauthorized - inte inloggad (403 är forbidden)
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error
   })
  }
};

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.post("/register", async (req, res) => { // in the frontend "register" and "login" are at the same endpoint, so this does not work
  const { username, password } = req.body;
    try {
      const salt = bcrypt.genSaltSync();
      if (password.length < 5) {
        res.status(400).json({
          success: false,
          response: "Password must be at least 5 characters long"
        })
      } else {
        const newUser = await new User({username: username, password: bcrypt.hashSync(password, salt)}).save();
        res.status(201).json({
          success: true,
          response: {
            username: newUser.username,
            accessToken: newUser.accessToken,
            id: newUser._id
          }
        });
      }
    } catch(error) {
      res.status(400).json({
        success: false,
        response: error // vi måste fixa så error syns i frontend
      });
    }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({username});
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        response: {
          username: user.username,
          accessToken: user.accessToken,
          id: user._id
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Incorrect username or password. Type the correct username and password, and try again."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    });
  }
});

app.get("/thoughts", authenticateUser);
app.get("/thoughts", async (req, res) => { // this endpoint is not in the frontend
  const thoughts = await Thought.find({})
  res.status(200).json({
    success: true,
    response: thoughts
  })
})

app.post("/thoughts", authenticateUser);
app.post("/thoughts", async (req, res) => {
    const { message } = req.body;
    try {
        const newThought = await new Thought({message}).save()
        res.status(201).json({ // 201 är för nya skapade grejer
            success: true,
            response: newThought
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            response: error
        })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


