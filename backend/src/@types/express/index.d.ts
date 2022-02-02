import { IUser } from '@entities/User';

declare module 'express' {
  export interface Request {
    body: {
      user: IUser;
      nodeId: string;
      variables: string[];
    };
  }
}
