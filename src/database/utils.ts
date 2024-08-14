import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const getAllTasks = async (name?) => {
  if (name) {
    return await AppDataSource.getRepository(Task)
      .createQueryBuilder("task")
      .where("task.member @> :member ", {
        member: [name],
      })
      .getMany();
  } else {
    return await AppDataSource.getRepository(Task)
      .createQueryBuilder("task")
      .getMany();
  }
};

export const updateTask = async (task) => {
  // validacia vstupnych dat pre pridavanie members
  const items = task.member.split(",");
  const clearItem = items.map((item) => item.split(" ").join(""));
  const memberFromDb = await getAllUsers();
  const nameOfMemberFromDb = memberFromDb.map((user) => user.name);
  const clearMembers = clearItem.filter((member) =>
    nameOfMemberFromDb.includes(member)
  );

  await removeRelation(task);

  task.member = clearMembers;

  await AppDataSource.createQueryBuilder()
    .update(Task)
    .set(task)
    .where("task.id = :id", { id: task.id })
    .execute();

  await addRelation(task);
};

export const createTask = async (newTask) => {
  if (!Array.isArray(newTask.member)) {
    newTask.member = [newTask.member];
  }

  const createTask = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Task)
    .values(newTask)
    .execute();

  const getNewTask = await AppDataSource.getRepository(Task)
    .createQueryBuilder("task")
    .where("task.id = :id ", { id: createTask.raw[0].id })
    .getOne();

  await addRelation(getNewTask);
};

export const createUser = async (user) => {
  const findRegisteredUser = await findUser(user);
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

async function addRelation(task) {
  const members = task.member;

  for (const member of members) {
    const findUser = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.name = :name ", { name: member })
      .getOne();

    await AppDataSource.createQueryBuilder() // create relation n to n
      .relation(User, "task")
      .of(findUser)
      .add(task);
  }
}

async function removeRelation(task) {
  const findTask = await AppDataSource.getRepository(Task)
    .createQueryBuilder("task")
    .where("task.id = :id ", { id: task.id })
    .getOne();

  const members = findTask.member;

  for (const member of members) {
    const findUser = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.name = :name ", { name: member })
      .getOne();

    await AppDataSource.createQueryBuilder() // remove relation n to n
      .relation(User, "task")
      .of(findUser)
      .remove(task);
  }
  // nenasiel som metodu, ktora dokaze jednoducho update relation , tak ich vymazem a vytvorim nanovo
}

export async function findUser(user) {
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
