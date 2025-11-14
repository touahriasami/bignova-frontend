import { CurrencyEnum } from '../enums/currency.enum';

export interface CompanyModel {
  _id?: string;
  userId?: string;
  name?: string;
  logo?: string;
  email?: string;
  phone?: string;
  iban?: string;
  currency: CurrencyEnum;
  raisonSociale: string;
  createdAt?: Date;
  updatedAt?: Date;
}
