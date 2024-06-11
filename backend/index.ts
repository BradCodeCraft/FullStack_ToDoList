import express from "express";
import { api } from "./api";
import session from "cookie-session";
import { auth } from "./auth";

const app = express();
app.use(
  session({
    secret: "secret",
  })
);

app.use(auth);
app.use(api);
app.get("/api/hi", (req, res) => res.send("hello"));
app.listen(3002, () => console.log("Server started"));
