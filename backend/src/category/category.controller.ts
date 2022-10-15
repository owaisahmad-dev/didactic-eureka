import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { Request, Response, Router } from "express";
import { TypedRequestBody } from "../../types";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create_category.dto";
import * as express from "express";
import { authMiddleware } from "../middlewares/auth";

const categoryController = Router();
const categoryService = new CategoryService();
categoryController.use(express.json());

categoryController.post(
  "/add",
  authMiddleware,
  async (req: TypedRequestBody<CreateCategoryDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(CreateCategoryDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }
    const category = await categoryService.createCategory(dto);
    if (category) {
      return res.status(201).send(category);
    }
    return res.status(500).send({ error: "Failed to add tenant" });
  }
);

categoryController.get("/all", async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  return res.status(200).send(categories);
});

categoryController.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = await categoryService.deleteCategory(id);

  if (category) {
    return res.status(200).send(category);
  }
  return res.status(500).send({ error: "Failed to delete category" });
});

export default categoryController;
