import { IUserRole } from "./user.model";

export interface AuthPayload {
  id: string;
  username: string;
  email?: string;
  roles?: IUserRole[];
}
