import { userRepository } from "../repositories/userRepository";
import { User } from "../entities/User";
import { message, userRegistration } from "../type";
import bcrypt = require("bcrypt");
import { FindOptionsWhere } from "typeorm";

export class UserService {
  static createUser = async (user: userRegistration): Promise<message> => {
    try {
      user.password = await bcrypt.hash(user.password, 10);
    } catch (e) {
      console.log("Error with hash password: ", e);
    }
    const findRegisteredUser = await this.findUser([
      { name: user.name },
      { email: user.email },
    ]);
    let resoult: message;

    if (!findRegisteredUser) {
      await userRepository.save(user);

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

  static getAllUsers = async (): Promise<string[]> => {
    return (await userRepository.find()).map((user) => user.name);
  };

  static async findUser(
    condition: FindOptionsWhere<User> | FindOptionsWhere<User>[]
  ): Promise<User | null> {
    return await userRepository.findOneBy(condition);
  }
}
