import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
dotenv.config();

interface Comment {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.post("/event", async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    const {
      id,
      postId,
      content,
    }: { id: string; postId: string; content: string } = data;

    switch (type) {
      case "CommentCreated":
        console.log("Event: CommentCreated");

        await axios.post("http://localhost:6004/event", {
          type: "CommentUpdated",
          data: {
            postId,
            content,
            id: id,
            status: content.toLowerCase().includes("red")
              ? "rejected"
              : "approved",
          },
        });
        return res.send({});

      default:
        console.log(`Received event type: ${type}`);
        res.send({});
    }
  } catch (error) {
    res.status(500).send("Moderator query error error");
  }
});

app.listen(port, () => {
  console.log(
    `[Moderator server]: Server is running at http://localhost:${port}`
  );
});
