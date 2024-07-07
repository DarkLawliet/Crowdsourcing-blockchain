import { createServer } from "http";
import next from "next";
import Routes from "next-routes";

const app = next({
  dev: process.env.NODE_ENV !== "production",
});

const routes = Routes();
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(3000, (err) => {
    if (err) throw err;
    console.log("Running on localhost:3000");
  });
});
