import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Task } from "../entities/Task";

@Resolver()
export class TaskResolver {
  @Query(() => String)
  hello(): string {
    return "hello world";
  }

  @Query(() => [Task])
  tasks(): Promise<Task[]> {
    return Task.find({});
  }

  @Query(() => Task, { nullable: true })
  task(
    @Arg("id", () => Int)
    id: number
  ): Promise<Task | null> {
    return Task.findOne({ where: { id: id } });
  }

  @Mutation(() => Task)
  createTask(
    @Arg("title", () => String)
    title: string
  ): Promise<Task> {
    return Task.create({ title, isCompleted: false }).save();
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Arg("id", () => Int)
    id: number
  ): Promise<boolean> {
    const result = await Task.delete({ id });
    return result.affected === 1 ? true : false;
  }

  @Mutation(() => Boolean, { nullable: true })
  async updateTask(
    @Arg("id", () => Int)
    id: number,
    @Arg("isCompleted", () => Boolean)
    isCompleted: boolean
  ): Promise<boolean | null> {
    const task = Task.findOne({ where: { id: id } });
    
    if (!task) return null;

    const result = await Task.update({ id }, { isCompleted });

    return result.affected === 0 ? false : true;
  }
}
