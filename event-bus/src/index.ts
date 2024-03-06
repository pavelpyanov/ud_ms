import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
dotenv.config();

interface Event {
  type: string;
  payload: any;
}

const events: Event[] = [];

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get("/events", (req: Request, res: Response) => {
  res.send(events);
});

app.post("/event", async (req: Request, res: Response) => {
  const event = req.body;

  console.log({ event });
  events.push(event);

  await axios
    .post("http://localhost:6001/event", event)
    .catch((e) => console.log("Error 6001"));
  await axios
    .post("http://localhost:6002/event", event)
    .catch((e) => console.log("Error 6002"));
  await axios
    .post("http://localhost:6005/event", event)
    .catch((e) => console.log("Error 6003"));
  await axios
    .post("http://localhost:6006/event", event)
    .catch((e) => console.log("Error 6004"));

  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(
    `[Event-bus server]: Server is running at http://localhost:${port}`
  );
});
