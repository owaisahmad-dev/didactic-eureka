import { Repository } from "typeorm";
import { pgDataSource } from "../data_source";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create_category.dto";

export class CategoryService {
  categoryRepository: Repository<Category>;
  constructor() {
    this.categoryRepository = pgDataSource.getRepository(Category);
    console.log("Initialized category service new");
  }

  async createCategory(CreateCategoryDto: CreateCategoryDto) {
    let category = this.categoryRepository.create(CreateCategoryDto);

    let isSuccess = true;
    category = await this.categoryRepository.save(category).catch((err) => {
      console.error(err.message);
      isSuccess = false;
      return null;
    });
    return isSuccess ? category : null;
  }

  async getAllCategories() {
    let categories = this.categoryRepository.find({
      relations: {
        questions: true,
      },
    });
    return categories;
  }

  async deleteCategory(id: string) {
    const res = await this.categoryRepository.delete(id);
    return res.affected ? true : false;
  }
}
