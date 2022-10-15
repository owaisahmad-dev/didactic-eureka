import axios from "axios";

const NextApiClient = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

const BotApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export { NextApiClient, BotApiClient };
