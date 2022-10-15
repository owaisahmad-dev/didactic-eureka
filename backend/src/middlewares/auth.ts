import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Tenant } from "../tenant/tenant.entity";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded == "string") {
      throw new Error("Invalid token");
    }
    if (decoded.type && decoded.type === "admin") {
      req.admin = true;
    } else {
      req.tenant = decoded as Tenant;
    }
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token" });
  }
};
