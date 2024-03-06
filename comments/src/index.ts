import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import axios from "axios";
dotenv.config();

interface Comment {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

const commentsByPostId: Record<string, Comment[]> = {};

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.get("/posts/:id/comments", (req: Request, res: Response) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req: Request, res: Response) => {
  const commentId = randomBytes(4).join("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ content, id: commentId, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:6004/event", {
    type: "CommentCreated",
    data: {
      postId: req.params.id,
      content,
      id: commentId,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/event", (req: Request, res: Response) => {
  const { type, data } = req.body;

  console.log(`Received event type: ${type}`);

  const { id, postId, content, status } = data;

  switch (type) {
    case "CommentUpdated":
      commentsByPostId[postId] = commentsByPostId[postId].map((item) => {
        if (item.id === id) {
          return { id, content, status };
        }
        return item;
      });

      return res.send({});

    default:
      res.send({});
  }
});

app.listen(port, () => {
  console.log(
    `[Comments server]: Server is running at http://localhost:${port}`
  );
});
