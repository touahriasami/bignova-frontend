import { CurrencyEnum } from '../enums/currency.enum';
import { QuoteStatusEnum } from '../enums/quote-status.enum';
import { Client } from './client.model';

export interface Item {
  description: string;
  quantity: number;
  unitPriceHT: number;
  tvaRate: number;
}

export interface Quote {
  _id: string;
  companyId?: string;
  clientId: Client;
  quoteNumber?: string;
  items: Item[];
  subTotalHT?: number;
  tvaTotal?: number;
  totalTTC?: number;
  status: QuoteStatusEnum;
  currency: CurrencyEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
