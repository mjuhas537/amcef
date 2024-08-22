import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import {
  message,
  reqCreateTask,
  reqUpdateTask,
  userRegistration,
} from "../type";

export const getAllTasks = async (
  nameOfUserLoged?: string
): Promise<Task[]> => {
  const allTask = await AppDataSource.getRepository(Task)
    .createQueryBuilder("task")
    .leftJoin("task.user", "user")
    .select(["task", "user.name", "user.id"])
    .getMany();

  if (nameOfUserLoged) {
    // len tie tasky, v kt sa objevil user
    return allTask.filter(
      (task) =>
        task.author == nameOfUserLoged ||
        task.user.find((item) => item.name == nameOfUserLoged)
    );
  }

  return allTask;
};

export const updateTask = async (task: reqUpdateTask): Promise<void> => {
  // members (pole uzivatelov ) prijimam ako string, velmi nestatsne riesenie  - nutne spracovanie udaju
  // editacia vstupnych dat pre pridavanie member
  // rozdelenie stringu do pola members po ciarkach, nasledne vymazanie medzier
  const items = task.member?.split(",");
  const clearItem = items?.map((item) => item.split(" ").join(``));
  const nameOfMemberFromDb = await getAllUsers();
  // kontrola nech nie je mozne pridelit ulohu nezaregistrovanemu user
  const confirmMembers = clearItem?.filter((member) =>
    nameOfMemberFromDb.includes(member)
  );
  // vymazanie duplicity dat
  const removeDuplicateItem = confirmMembers?.filter(
    (item, index) => confirmMembers.indexOf(item) === index
  );
  delete task.member; // ORM model TASK neobsajuje udaj members, ale vytvara sa vztah s tabulkou Users
  await removeRelation(task.id);

  task.deadline = new Date(task.deadline);

  await AppDataSource.createQueryBuilder()
    .update(Task)
    .set(task)
    .where("task.id = :id", { id: task.id })
    .execute();

  removeDuplicateItem?.length &&
    (await addRelation(task.id, removeDuplicateItem));
};

export const createTask = async (
  newTask: reqCreateTask,
  user: User
): Promise<void> => {
  newTask.deadline = new Date(newTask.deadline);
  const createTask = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Task)
    .values(newTask)
    .execute();

  await AppDataSource.createQueryBuilder()
    .relation(User, "task")
    .of(user)
    .add(createTask.raw[0].id);
};

export const createUser = async (user: userRegistration): Promise<message> => {
  const findRegisteredUser = await confimrUser(user);
  let resoult: message;

  if (!findRegisteredUser) {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    resoult = {
      status: "created",
      message: `User ${user.name}  /  ${user.email} was registered. `,
    };
  } else {
    const name =
      user.name == findRegisteredUser.name ? `name ${user.name}` : "";
    const email =
      user.email == findRegisteredUser.email ? `email ${user.email}` : "";

    resoult = {
      status: "exist",
      message: `User with the same ${name} ${email} exist.`,
    };
  }
  return resoult;
};

export const getAllUsers = async (): Promise<string[]> => {
  return (
    await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .select(["user.name"])
      .getMany()
  ).map((user) => user.name);
};

async function addRelation(
  taskId: string,
  confirmMembers: string[]
): Promise<void> {
  for (const member of confirmMembers) {
    const userFromDb = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.name = :name ", { name: member })
      .getOne();

    await AppDataSource.createQueryBuilder() // create relation n to n
      .relation(User, "task")
      .of(userFromDb)
      .add(taskId);
  }
}

async function removeRelation(taskId: string): Promise<void> {
  const findTask = await AppDataSource.getRepository(Task)
    .createQueryBuilder("task")
    .where("task.id = :id ", { id: taskId })
    .leftJoin(`task.user`, `user`)
    .select(["task", "user.id"])
    .getOne();

  if (findTask?.user.length) {
    const users = findTask.user.map((user) => user.id);

    for (const user of users) {
      await AppDataSource.createQueryBuilder() // remove relation n to n
        .relation(User, "task")
        .of(user)
        .remove(findTask);
    }
  }
  // nenasiel som metodu, ktora dokaze jednoducho update relation , tak ich vymazem a vytvorim nanovo
}

async function confimrUser(user: userRegistration): Promise<User | null> {
  return await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.name = :name ", { name: user.name })
    .orWhere("user.email = :email ", { email: user.email })
    .getOne();
}

export async function findUserById(id: string): Promise<User | null> {
  return await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id ", { id: id })
    .getOne();
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email ", { email: email })
    .getOne();
}

export function checkAuthenticated(
  req: { isAuthenticated: () => any },
  res: { redirect: (arg0: string) => void },
  next: () => any
) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/intro");
}
