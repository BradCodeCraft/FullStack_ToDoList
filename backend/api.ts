import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/task";
import { TasksController } from "../shared/TasksController";

export const api = remultExpress({
  entities: [Task],
  controllers: [TasksController],
  getUser: (req) => req.session!["user"],
});
