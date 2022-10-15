import { In, Repository } from "typeorm";
import { QueuedQuestion } from "../channel/channel.entity";
import { pgDataSource } from "../data_source";
import { CreateQuestionDto } from "./dto/create_question.dto";
import { UpdateQuestionDto } from "./dto/update_question.dto";
import { Question } from "./question.entity";

export class QuestionService {
  questionRepository: Repository<Question>;

  constructor() {
    this.questionRepository = pgDataSource.getRepository(Question);
  }

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const { categoryIds, ...other } = createQuestionDto;
    let question = await this.questionRepository.create({
      ...other,
      categories: categoryIds.map((id) => ({ id })),
    });

    let isSuccess = true;
    question = await this.questionRepository.save(question).catch((err) => {
      console.error(err.message);
      isSuccess = false;
      return null;
    });

    return isSuccess ? question : null;
  }

  async getNewQuestion(
    allowedCategories: string[],
    tenantId: string,
    questionsInQueue: string[]
  ) {
    const questions: Question[] = await this.questionRepository
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.categories", "category")
      .leftJoinAndSelect("question.answered_by", "tenant")
      .where("question.id::VARCHAR NOT IN (:...questionsInQueue)", {
        questionsInQueue,
      })
      .andWhere(`category.id::VARCHAR IN (:...allowedCategories)`, {
        allowedCategories,
      })
      .andWhere("tenant.id IS NULL")
      .orWhere("tenant.id::VARCHAR != (:tenantId)", { tenantId })
      .limit(1)
      .printSql()
      .getMany()
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (!questions || questions.length === 0) {
      return null;
    }
    return questions[0];
  }

  async createQuestionsQueue(allowedCategories: string[]) {
    const allPossibleQuestions = await this.questionRepository
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.categories", "category")
      .where(`category.id::VARCHAR IN (:...allowedCategories)`, {
        allowedCategories,
      })
      .limit(4)
      .getMany()
      .catch((err) => {
        return null;
      });

    return allPossibleQuestions;
  }

  async getQuestionById(id: string) {
    let isSuccess = true;
    const question = await this.questionRepository
      .findOne({
        where: {
          id,
        },
        relations: {
          categories: true,
          answered_by: true,
        },
      })
      .catch((e) => {
        console.error("Error: ", e.message);
        isSuccess = false;
      });
    return isSuccess ? question : null;
  }

  async updateAnsweredBy(id: string, tenantId: string) {
    let question = await this.getQuestionById(id);
    if (!question) {
      return null;
    }

    const answered_by = question.answered_by;

    question = this.questionRepository.create({
      ...question,
      answered_by: [...answered_by, { id: tenantId }],
    });

    question = await this.questionRepository.save(question);
    return question;
  }

  async findAll() {
    const questions = await this.questionRepository.find({
      relations: {
        categories: true,
      },
    });
    return questions;
  }

  async removeQuestion(id: string) {
    const res = await this.questionRepository.delete(id);
    return res.affected > 0 ? true : false;
  }

  async updateQuestion(dto: UpdateQuestionDto) {
    let question = await this.questionRepository.create({
      id: dto.id,
      text: dto.text,
      categories: dto.categoryIds.map((id) => ({ id })),
    });
    question = await this.questionRepository.save(question);
    return question ? true : false;
  }
}
