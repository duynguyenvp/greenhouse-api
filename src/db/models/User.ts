import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from "typeorm";
import { ROLES_ENUM } from "../roles";
import dataSource from "../dataSource";

@Entity("user")
@Index("user_search_vector_idx", ["search_vector"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ default: ROLES_ENUM.EMPLOYEE_ROLE })
  role: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  password: string;

  @Column({ type: "tsvector", select: false })
  search_vector: string;

  // Tính toán và cập nhật search_vector khi thêm hoặc cập nhật khách hàng
  @BeforeInsert()
  @BeforeUpdate()
  async updateSearchVector() {
    const vector = await dataSource.query(
      `select to_tsvector('simple', unaccent('${this.name ?? ""}'))`
    );
    this.search_vector = vector[0].to_tsvector;
  }
}
