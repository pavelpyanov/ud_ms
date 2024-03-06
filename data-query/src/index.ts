import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

interface Comment {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const posts: Record<string, Post> = {};

const eventHandler = (type: string, data: any) => {
  const { id, title, postId, content, status } = data;

  switch (type) {
    case "PostCreated":
      console.log("Event: PostCreated");

      posts[id] = { id, title, comments: [] };

      return true;

    case "CommentCreated":
      console.log("Event: CommentCreated");

      if (!posts[postId]) return;

      posts[postId].comments = [
        ...posts[postId].comments,
        { id, content: "######", status },
      ];

      return true;

    case "CommentUpdated":
      console.log("Event: CommentUpdated");

      posts[postId].comments = posts[postId].comments.map((item) => {
        if (item.id === id) {
          return {
            id,
            content: status === "approved" ? content : "#####",
            status,
          };
        }
        return item;
      });

      return true;

    default:
      return false;
  }
};

app.get("/posts", (req: Request, res: Response) => {
  res.send(posts);
});

app.post("/event", async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    const isEventHandled = eventHandler(type, data);

    if (isEventHandled) {
      res.send({});
    } else {
      res.status(404);
    }
  } catch (error) {
    res.status(500).send("Data query error error");
  }
});

app.listen(port, async () => {
  console.log(
    `[Data-query server]: Server is running at http://localhost:${port}`
  );

  console.log("Events request");

  try {
    const { data: responseData } = await axios.get<
      { type: string; data: any }[]
    >("http://localhost:6004/events");

    if (responseData && responseData.length) {
      responseData.forEach((item) => {
        console.log(`Processing event: ${item.type}`);
        console.log({ data: item.data });
        eventHandler(item.type, item.data);
      });
    } else {
      console.log("No events to handle");
    }
  } catch (error) {
    console.log("Error happen while getting error", error);
  }
});
