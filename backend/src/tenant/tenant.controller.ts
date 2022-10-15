import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { Response, Router, Request } from "express";
import { TypedRequestBody } from "../../types";
import { CreateTenantDto } from "./dto/create_tenant.dto";
import { UpdateTenantDto } from "./dto/update_tenant.dto";
import { TenantService } from "./tenant.service";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth";

const tenantController = Router();
const tenantService = new TenantService();
tenantController.use(express.json());

tenantController.post(
  "/add",
  async (req: TypedRequestBody<CreateTenantDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(CreateTenantDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const tenant = await tenantService.createTenant(dto);
    if (tenant) {
      const token = jwt.sign({ tenant: tenant }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).send(token);
    }
    return res.status(500).send({ error: "Failed to add tenant" });
  }
);

tenantController.get("/", async (req: Request, res: Response) => {
  // get tenant id from query params
  const tenantId = req.query.id as string;
  if (!tenantId) {
    const tenants = await tenantService.findAll();
    return res.status(200).send(tenants);
  }
  const tenant = await tenantService.findTenantById(tenantId as string);
  if (tenant) {
    return res.status(200).send(tenant);
  }
  return res.status(404).send({ error: "Tenant not found" });
});

tenantController.put(
  "/",
  authMiddleware,
  async (req: TypedRequestBody<UpdateTenantDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(UpdateTenantDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { id, updateObject } = dto;

    const tenant = await tenantService.updateTenant(id, updateObject);
    if (tenant) {
      return res.status(200).send(tenant);
    }
    return res.status(500).send({ error: "Failed to update tenant" });
  }
);

tenantController.post(
  "/login",
  async (req: TypedRequestBody<{ workspaceId: string }>, res: Response) => {
    const { workspaceId } = req.body;
    if (!workspaceId) {
      return res.status(400).send({ message: "accessToken is required" });
    }
    const tenant = await tenantService.findByWorkspaceId(workspaceId);
    if (tenant) {
      const token = jwt.sign({ tenant }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).send({ token });
    }
    return res.status(404).send({ error: "Tenant not found" });
  }
);

tenantController.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!req.admin) {
      return res.status(403).send({ error: "Forbidden" });
    }
    const tenant = await tenantService.removeTenant(id);
    if (tenant) {
      return res.status(200).send(tenant);
    }
    return res.status(500).send({ error: "Failed to remove tenant" });
  }
);

export default tenantController;
export { tenantService };
