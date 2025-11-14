import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AddQuote } from './add-quote/add-quote';
import { Quote } from '../../core/models/quote.model';
import { Observable, of } from 'rxjs';
import { QuotesService } from '../../core/services/quotes.service';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ClientsService } from '../../core/services/clients.service';
import { Client } from '../../core/models/client.model';
import { ViewQuote } from './view-quote/view-quote';

@Component({
  selector: 'app-quotes',
  imports: [AddQuote, AsyncPipe, NgFor, NgIf, DatePipe, ViewQuote],
  templateUrl: './quotes.html',
  styleUrl: './quotes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Quotes implements OnInit {
  quotes$: Observable<Quote[]> = of([]);
  clients$: Observable<Client[]> = of([]);
  loading: boolean = false;
  deleteQuoteId: string | null = null;
  convertQuoteId: string | null = null;
  acceptQuoteId: string | null = null;
  sendQuoteId: string | null = null;
  selectedQuoteId: string | null = null;

  constructor(
    private readonly quotesService: QuotesService,
    private readonly clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.quotes$ = this.quotesService.quotes$;
    this.quotesService.loadQuotes();

    this.clients$ = this.clientsService.clients$;

    this.clients$.subscribe((res) => {
      console.log('res : ', res);
    });
    this.clientsService.loadClients();
  }

  showQuote(quoteId: string) {
    this.selectedQuoteId = quoteId;
    (document.getElementById('viewQuote') as HTMLDialogElement)?.show();
  }

  sendQuote(quoteId: string) {
    this.sendQuoteId = quoteId;
    this.quotesService.updateStatus(quoteId, 'SENT').subscribe(() => {
      // this.quotesService.loadQuotes();
      this.sendQuoteId = null;
    });
  }

  acceptQuote(quoteId: string) {
    this.acceptQuoteId = quoteId;
    this.quotesService.updateStatus(quoteId, 'ACCEPTED').subscribe(() => {
      // this.quotesService.loadQuotes();
      this.acceptQuoteId = null;
    });
  }

  convertToInvoice(quoteId: string) {
    this.convertQuoteId = quoteId;
    this.loading = true;
    this.quotesService.convertToInvoice(quoteId).subscribe(() => {
      this.loading = false;
      this.convertQuoteId = null;
    });
  }

  deleteQuote(quoteId: string) {
    this.deleteQuoteId = quoteId;
    this.loading = true;
    this.quotesService.deleteQuote(quoteId)?.subscribe(() => {
      this.loading = false;
      this.deleteQuoteId = null;
      this.quotesService.loadQuotes();
    });
  }
}
