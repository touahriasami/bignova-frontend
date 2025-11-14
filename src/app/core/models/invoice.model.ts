import { Company } from '../../features/company/company';
import { InvoiceStatusEnum } from '../enums/invoice-status.enum';
import { Client } from './client.model';
import { Item } from './quote.model';

export interface Invoice {
  _id: string;
  companyId?: Company;
  clientId: Client;
  quoteId?: string;
  invoiceNumber?: string;
  items: Item[];
  subTotalHT?: number;
  tvaTotal?: number;
  totalTTC?: number;
  status: InvoiceStatusEnum;
  currency: 'EUR' | 'DZD' | 'USD';
  paidDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
