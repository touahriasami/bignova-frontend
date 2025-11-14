export interface Client {
  _id?: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
