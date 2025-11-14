import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QuotesService } from '../../../core/services/quotes.service';
import { Quote } from '../../../core/models/quote.model';

@Component({
  selector: 'app-view-quote',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe],
  templateUrl: './view-quote.html',
  styleUrl: './view-quote.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewQuote implements OnChanges {
  @Input() quoteId: string | null = null;

  loading = false;
  quote$: Observable<Quote | null> = of(null);

  constructor(private readonly quotesService: QuotesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quoteId'] && this.quoteId) {
      this.loading = true;
      this.quote$ = this.quotesService.getQuoteById(this.quoteId).pipe(
        catchError(() => {
          this.loading = false;
          return of(null);
        })
      );
    }
  }
}
