import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const getAllTasks = async (userLoged?) => {
  if (userLoged) {
    return await AppDataSource.getRepository(Task)
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.user", "user")
      .where("user.name = :name", {
        name: userLoged,
      })
      .orWhere("task.author = :author ", {
        author: userLoged,
      })
      .select(["task", "user.name", "user.email", "user.id"])
      .getMany();
  }

  return await AppDataSource.getRepository(Task)
    .createQueryBuilder("task")
    .leftJoin("task.user", "user")
    .select(["task", "user.name", "user.email", "user.id"])
    .getMany();
};

export const updateTask = async (task) => {
  // validacia vstupnych dat pre pridavanie member
  const items = task.member.split(",");
  const clearItem = items.map((item) => item.split(" ").join(""));
  const memberFromDb = await getAllUsers();
  const nameOfMemberFromDb = memberFromDb.map((user) => user.name);
  // kontrola nech nie je mozne pridelit ulohu nezaregistrovanemu user
  const confirmMembers = clearItem.filter((member) =>
    nameOfMemberFromDb.includes(member)
  );

  task.deadline = new Date(task.deadline);
  delete task.member;
  await removeRelation(task);

  await AppDataSource.createQueryBuilder()
    .update(Task)
    .set(task)
    .where("task.id = :id", { id: task.id })
    .execute();

  await addRelation(task, confirmMembers);
};

export const createTask = async (newTask, user) => {
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

export const createUser = async (user) => {
  const findRegisteredUser = await confimrUser(user);
  let resoult;

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

export const getAllUsers = async () => {
  const getAllUsers = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .select(["user.name"])
    .getMany();

  return getAllUsers;
};

async function addRelation(task, confirmMembers) {
  const members = confirmMembers;

  for (const member of members) {
    const userFromDb = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.name = :name ", { name: member })
      .getOne();

    await AppDataSource.createQueryBuilder() // create relation n to n
      .relation(User, "task")
      .of(userFromDb)
      .add(task);
  }
}

async function removeRelation(task) {
  const findTask = await AppDataSource.getRepository(Task)
    .createQueryBuilder("task")
    .where("task.id = :id ", { id: task.id })
    .innerJoin(`task.user`, `user`)
    .select(["task", "user.id"])
    .getOne();

  if (findTask) {
    const users = findTask.user.map((user) => user.id);
    for (const user of users) {
      await AppDataSource.createQueryBuilder() // remove relation n to n
        .relation(User, "task")
        .of(user)
        .remove(task);
    }
  }
  // nenasiel som metodu, ktora dokaze jednoducho update relation , tak ich vymazem a vytvorim nanovo
}

async function confimrUser(user) {
  const findOne = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.name = :name ", { name: user.name })
    .orWhere("user.email = :email ", { email: user.email })
    .getOne();

  return findOne;
}

export async function findUserById(id) {
  const findOne = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id ", { id: id })
    .getOne();

  return findOne;
}

export async function findUserByEmail(email) {
  const findOne = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email ", { email: email })
    .getOne();
  return findOne;
}
