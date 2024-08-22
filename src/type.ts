export enum flag {
  CREATED = "crated",
  REALIZED = "realized",
  DONE = "done",
  CANCEL = "cancel",
}

export interface userRegistration extends userLogging {
  name: string;
}

export interface userLogging {
  email: string;
  password: string;
}

export interface reqCreateTask {
  title: string;
  description: string;
  author: string;
  deadline: Date;
  flag: flag;
}

export interface reqUpdateTask extends reqCreateTask {
  id: string;
  member?: string;
}

export interface message {
  status: string;
  message: string;
}
