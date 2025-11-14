import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Invoice } from '../../../core/models/invoice.model';
import { InvoicesService } from '../../../core/services/invoices.service';

@Component({
  selector: 'app-show-invoice',
  imports: [AsyncPipe, DatePipe, NgIf, NgFor],
  templateUrl: './show-invoice.html',
  styleUrl: './show-invoice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowInvoice implements OnChanges {
  @Input() invoiceId: string | null = null;
  invoice$: Observable<Invoice | null> = of(null);
  loading = false;

  constructor(private readonly invoicesService: InvoicesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceId'] && this.invoiceId) {
      this.loading = true;
      this.invoice$ = this.invoicesService.getInvoiceById(this.invoiceId).pipe(
        catchError(() => {
          this.loading = false;
          return of(null);
        })
      );
    }
  }
}
