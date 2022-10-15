import { DataSource } from "typeorm";
import { BillingHistory } from "./billing_history/billing_history.entity";
import { Category } from "./category/category.entity";
import { Channel } from "./channel/channel.entity";
import { Question } from "./question/question.entity";
import { Tenant } from "./tenant/tenant.entity";

const pgDataSource: DataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Tenant, Category, Channel, Question, BillingHistory],
  synchronize: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

export { pgDataSource };
