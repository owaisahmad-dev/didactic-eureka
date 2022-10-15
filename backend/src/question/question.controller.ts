import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { Request, Response, Router } from "express";
import { TypedRequestBody } from "../../types";
import { CreateQuestionDto } from "./dto/create_question.dto";
import { Question } from "./question.entity";
import { QuestionService } from "./quetsion.service";
import * as express from "express";
import { UpdateQuestionDto } from "./dto/update_question.dto";
import { authMiddleware } from "../middlewares/auth";

const questionController = Router();
const questionService = new QuestionService();
questionController.use(express.json());

questionController.post(
  "/add",
  authMiddleware,
  async (req: TypedRequestBody<CreateQuestionDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(CreateQuestionDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }
    const question = await questionService.createQuestion(dto);
    if (question) {
      return res.status(201).send(question);
    }
    return res.status(500).send({ error: "Failed to add question" });
  }
);

questionController.get("", async (req: Request, res: Response) => {
  const question = await questionService.findAll();

  if (!question) {
    return res.status(404).send({ error: "Question not found" });
  }

  return res.json(question);
});

questionController.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const question = await questionService.removeQuestion(id);

  if (!question) {
    return res.status(404).send({ error: "Question not found" });
  }

  return res.json(question);
});

questionController.put(
  "",
  async (req: TypedRequestBody<UpdateQuestionDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(UpdateQuestionDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const question = await questionService.updateQuestion(dto);
    if (question) {
      return res.status(201).send(question);
    }
    return res.status(500).send({ error: "Failed to update question" });
  }
);

export default questionController;

export { questionService };
