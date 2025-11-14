import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InvoicesService } from '../../core/services/invoices.service';
import { Observable, of } from 'rxjs';
import { Invoice } from '../../core/models/invoice.model';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MarkAsPaid } from './mark-as-paid/mark-as-paid';
import { ShowInvoice } from './show-invoice/show-invoice';

@Component({
  selector: 'app-invoices',
  imports: [AsyncPipe, NgIf, NgFor, DatePipe, MarkAsPaid, ShowInvoice],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Invoices implements OnInit {
  invoices$: Observable<Invoice[] | null> = of(null);

  deleteInvoiceId: string | null = null;
  selectedInvoice: string | null = null;
  payeInvoiceId: string | null = null;
  loading: boolean = false;

  constructor(private invoiceService: InvoicesService) {}

  ngOnInit(): void {
    this.invoices$ = this.invoiceService.invoices$;
    this.invoiceService.loadInvoices();
  }

  markAsPaid(invoiceId: string) {
    this.payeInvoiceId = invoiceId;
    this.selectedInvoice = null;
    (document.getElementById('markAsPaid') as HTMLDialogElement)?.show();
  }

  showInvoice(invoiceId: string) {
    this.selectedInvoice = invoiceId;
    (document.getElementById('viewInvoice') as HTMLDialogElement)?.show();
  }

  deleteInvoice(invoiceId: string) {
    this.deleteInvoiceId = invoiceId;
    this.loading = true;
    this.invoiceService.deleteInvoice(invoiceId).subscribe(() => {
      this.loading = false;
      this.deleteInvoiceId = null;
      this.invoiceService.loadInvoices();
    });
  }
}
