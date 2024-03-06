import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
dotenv.config();

interface Post {
  id: string;
  title: string;
}

const posts: Record<string, Post> = {};

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/posts", (req: Request, res: Response) => {
  res.send(posts);
});

app.post("/posts", async (req: Request, res: Response) => {
  try {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    posts[id] = { title, id };

    await axios.post("http://localhost:6004/event", {
      type: "PostCreated",
      data: { title, id },
    });

    return res.status(201).send(posts[id]);
  } catch (error) {
    res.status(500).send("Post service error");
  }
});

app.post("/event", (req: Request, res: Response) => {
  const event = req.body;
  console.log(`Received event type: ${event.type}`);
  res.send({});
});

app.listen(port, () => {
  console.log(`[Posts server]: Server is running at http://localhost:${port}`);
});
