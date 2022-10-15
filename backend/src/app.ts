import "./config";

import * as express from "express";
import * as cors from "cors";
import { pgDataSource } from "./data_source";
import tenantController from "./tenant/tenant.controller";
import categoryController from "./category/category.controller";
import channelController, {
  channelService,
} from "./channel/channel.controller";
import questionController from "./question/question.controller";
import { paymentController } from "./payment/payment.controller";
import { authMiddleware } from "./middlewares/auth";
import { Tenant } from "./tenant/tenant.entity";
import { TypedRequestBody } from "../types";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "./utils";
import * as jwt from "jsonwebtoken";
import * as morgan from "morgan";

pgDataSource
  .initialize()
  .then(() => {
    console.log("Database initialized");
    channelService.restartAllCrons();
  })
  .catch((err) => {
    console.error("Database initialization failed", err);
  });

const app = express();

declare global {
  namespace Express {
    export interface Request {
      tenant?: Tenant;
      admin?: boolean;
    }
  }
}

app.use(morgan("tiny"));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/tenant", tenantController);
app.use("/category", categoryController);
app.use("/channel", channelController);
app.use("/question", questionController);
app.use("/payment", paymentController);

app.post(
  "/admin/login",
  express.json(),
  async (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        type: ADMIN_PASSWORD,
      },
      process.env.JWT_SECRET
    );

    res.send({ token });
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
});
