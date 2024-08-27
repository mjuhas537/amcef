import { checkSchema } from "express-validator";
import { flag } from "../type/type";

export class Validate {
  static registration = checkSchema({
    name: {
      in: ["body"],
      isString: true,
      exists: {
        errorMessage: "Name field is required",
      },
      isLength: {
        options: { min: 3, max: 20 },
        errorMessage: "Name must be at least 3 -20 characters long",
      },
      custom: {
        options: (value) => {
          // Skontroluje, či hodnota obsahuje medzery
          return !/\s/.test(value);
        },
        errorMessage: "Name should not contain spaces",
      },
    },
    email: {
      in: ["body"],
      exists: {
        errorMessage: "Email field is required",
      },
      isEmail: {
        errorMessage: "Invalid email format",
      },
      isLength: {
        options: { min: 5, max: 30 },
        errorMessage: "Email must be at least 5 - 20 characters long",
      },
    },
    password: {
      in: ["body"],
      isString: true,
      exists: {
        errorMessage: "Password field is required",
      },
      isLength: {
        options: { min: 5, max: 16 },
        errorMessage: "Password must be at least 5 - 16 characters long",
      },
    },
  });
  static loggin = checkSchema({
    email: {
      in: ["body"],
      exists: {
        errorMessage: "Email field is required",
      },
      isEmail: {
        errorMessage: "Invalid email format",
      },
      isLength: {
        options: { min: 5, max: 30 },
        errorMessage: "Email must be at least 5 - 20 characters long",
      },
    },
    password: {
      in: ["body"],
      exists: {
        errorMessage: "Password field is required",
      },
      isLength: {
        options: { min: 5, max: 16 },
        errorMessage: "Password must be at least 5 - 16 characters long",
      },
    },
  });
  static createTask = checkSchema({
    title: {
      in: ["body"],
      isString: true,
      exists: {
        errorMessage: "Title field is required",
      },
      isLength: {
        options: { min: 1, max: 30 },
        errorMessage: "Title must be between 1 and 30 characters long",
      },
    },
    description: {
      in: ["body"],
      exists: {
        errorMessage: "Description field is required",
      },
      isString: true,
      isLength: {
        options: { min: 1, max: 300 },
        errorMessage: "Description must be between 1 and 300 characters long",
      },
    },
    author: {
      in: ["body"],
      exists: {
        errorMessage: "Author field is required",
      },
      isString: true,
      isLength: {
        options: { min: 3, max: 20 },
        errorMessage: "Author must be between 3 and 20 characters long",
      },
    },
    deadline: {
      in: ["body"],
      isString: true,
      exists: {
        errorMessage: "Deadline is required",
      },
      custom: {
        options: async (value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        errorMessage: "Invalid date format, valid is : yyyy-mm-dd",
      },
    },
    flag: {
      in: ["body"],
      exists: {
        errorMessage: "Flag is required",
      },
      isIn: {
        options: [[flag.CREATED, flag.REALIZED, flag.DONE, flag.CANCEL]],
        errorMessage:
          "Flag must be one of the following values: created, realized, done, cancel",
      },
    },
  });

  static updateTask = checkSchema({
    title: {
      in: ["body"],
      isString: true,
      exists: {
        errorMessage: "Title field is required",
      },
      isLength: {
        options: { min: 1, max: 30 },
        errorMessage: "Title must be between 1 and 30 characters long",
      },
    },
    description: {
      in: ["body"],
      exists: {
        errorMessage: "Description field is required",
      },
      isString: true,
      isLength: {
        options: { min: 1, max: 300 },
        errorMessage: "Description must be between 1 and 300 characters long",
      },
    },
    author: {
      in: ["body"],
      exists: {
        errorMessage: "Author field is required",
      },
      isString: true,
      isLength: {
        options: { min: 3, max: 20 },
        errorMessage: "Author must be between 3 and 20 characters long",
      },
    },
    deadline: {
      in: ["body"],
      isString: true,
      exists: {
        errorMessage: "Deadline is required",
      },
      custom: {
        options: async (value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        errorMessage: "Invalid date format, valid is : yyyy-mm-dd",
      },
    },
    flag: {
      in: ["body"],
      exists: {
        errorMessage: "Flag is required",
      },
      isIn: {
        options: [[flag.CREATED, flag.REALIZED, flag.DONE, flag.CANCEL]],
        errorMessage:
          "Flag must be one of the following values: created, realized, done, cancel",
      },
    },
    member: {
      in: ["body"],
      exists: {
        errorMessage: "Member is required",
      },
      isString: {
        errorMessage: "Member must be a string",
      },
    },
  });
}
