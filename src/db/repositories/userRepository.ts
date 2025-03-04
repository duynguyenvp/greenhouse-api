import { validate } from "class-validator";
import { User } from "../models/User";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { DataSource, Repository } from "typeorm";
import PaginatedUsers from "../../dto/paginatedUsers.dto";
import { removeAccents } from "../../utils/removeAccents";

class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }
  async findById(id: number) {
    const user = await this.repository.findOne({
      where: { id }
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.repository.findOne({
      where: { username }
    });
    if (!user) {
      throw new Error(`User with email ${username} not found`);
    }
    return user;
  }

  // Lấy tất cả khách hàng
  async getUsers(
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<PaginatedUsers> {
    const queryBuilder = this.repository.createQueryBuilder("user");
    if (keyword) {
      queryBuilder
        .where("user.search_vector @@ to_tsquery(:query)", {
          query: removeAccents(keyword).split(" ").join(" & ")
        });
      queryBuilder
        .andWhere("user.phone LIKE :phone", {
          phone: `%${keyword}%`
        })
        .andWhere("customer.email LIKE :email", { email: `%${keyword}%` });
    }
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);
    const [users, total] = await queryBuilder.getManyAndCount();
    return {
      pageIndex,
      pageSize,
      total,
      data: users
    };
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const errors = await validate(createUserDTO);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + JSON.stringify(errors));
    }
    const user = this.repository.create(createUserDTO);
    await this.repository.save(user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>) {
    const user = await this.findById(id);
    const updatedUser = Object.assign(user, updateData);
    await this.repository.save(updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number) {
    const user = await this.findById(id);
    await this.repository.remove(user);
  }

  async isUsernameExist(username: string) {
    const user = await this.repository.findOne({
      where: { username }
    });
    return !!user;
  }
}

export default UserRepository;
