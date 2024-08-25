import { taskRepository, userRepository } from "../repositories/userRepository";
import { User } from "../entities/User";
import { Task } from "../entities/Task";
import { reqCreateTask, reqUpdateTask } from "../type";
import { UserService } from "./userService";

export class TaskService {
  static getAllTasks = async (nameOfUserLoged?: string): Promise<Task[]> => {
    const allTask = await taskRepository.find({
      select: { user: { name: true, id: true } },
      relations: { user: true },
      order: { deadline: "DESC" },
    });
    if (nameOfUserLoged) {
      // ulohy pripadajuce prihlasenemu uzivatelovi
      // kde disponuje ako autor ulohy alebo ako spolupracovnik
      return allTask.filter(
        (task) =>
          task.author == nameOfUserLoged ||
          task.user.find((item) => item.name == nameOfUserLoged)
      );
    }
    return allTask;
  };

  static updateTask = async (task: reqUpdateTask): Promise<void> => {
    const confirmedMembers = await this.processTaskMembers(task);

    // ORM model TASK neobsajuje udaj members, ale vytvara sa vztah s tabulkou Users
    delete task.member;
    task.deadline = new Date(task.deadline);
    // nenasiel som metodu, ktora dokaze jednoducho update relation tj. odstranit zaniknute vztahy
    // tak ich vymazem vsetky a vytvorim nanovo
    // neviem pouzit metodu task.user = [users] a potom save(task) nepoznam iD pridanych users iba name
    await this.removeRelation(task.id);

    await taskRepository.save(task);

    confirmedMembers?.length &&
      (await this.addRelation(task.id, confirmedMembers));
  };

  static createTask = async (
    newTask: reqCreateTask,
    user: User
  ): Promise<void> => {
    newTask.deadline = new Date(newTask.deadline);
    newTask.user = [user];
    await taskRepository.save(newTask);
  };

  // private ani # nefunguje a musi ostat static inak this.method tiez nenajde metodu
  static async removeRelation(taskId: string): Promise<void> {
    const findTask = await taskRepository
      .createQueryBuilder("task")
      .where("task.id = :id ", { id: taskId })
      .leftJoin(`task.user`, `user`)
      .select(["task", "user.id"])
      .getOne();

    if (findTask?.user.length) {
      const users = findTask.user.map((user) => user.id);

      for (const user of users) {
        await userRepository
          .createQueryBuilder() // remove relation n to n
          .relation(User, "task")
          .of(user)
          .remove(findTask);
      }
    }
  }

  static async addRelation(
    taskId: string,
    confirmMembers: string[]
  ): Promise<void> {
    for (const member of confirmMembers) {
      const userFromDb = await userRepository.findOneBy({ name: member });
      await userRepository
        .createQueryBuilder() // create relation n to n
        .relation(User, "task")
        .of(userFromDb)
        .add(taskId);
    }
  }

  static async processTaskMembers(task: reqUpdateTask) {
    // Rozdelenie členov, odstránenie medzier a kontrola registrovaných užívateľov
    const nameOfMemberFromDb = await UserService.getAllUsers();
    const uniqueConfirmedMembers = task.member
      ?.split(",")
      .map((item) => item.split(" ").join(``)) // Odstránenie medzier
      .filter((member) => nameOfMemberFromDb.includes(member)) // Kontrola proti databáze
      .filter((item, index, self) => self.indexOf(item) === index); // Odstránenie duplicit

    return uniqueConfirmedMembers;
  }
}
