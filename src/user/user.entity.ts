import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
import * as crypto from 'crypto';
import { ArticleEntity } from "../article/article.entity";
import { CommentEntity } from "../article/comment.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');;
  }

  @ManyToMany((type) => ArticleEntity, (article) => article, {
    cascade: true,
  })
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.following)
  @JoinTable({
    name: "follower_following", // 此关系的联结表的表名
    joinColumn: {
      name: "followerId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "followingId",
      referencedColumnName: "id",
    },
  })
  follower: UserEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.follower)
  following: UserEntity[];
}
