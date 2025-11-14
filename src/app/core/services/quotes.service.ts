import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Quote } from '../models/quote.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  public quotes$ = this.quotesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadQuotes(): void {
    this.getAllQuotes().subscribe((quotes) => {
      this.quotesSubject.next(quotes);
    });
  }

  getAllQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${environment.apiUrl}/quotes`);
  }

  getQuoteById(id: string): Observable<Quote> {
    return this.http.get<Quote>(`${environment.apiUrl}/quotes/${id}`);
  }

  createQuote(quote: any): Observable<Quote> {
    return this.http.post<Quote>(`${environment.apiUrl}/quotes`, quote).pipe(
      tap(() => {
        this.loadQuotes();
      })
    );
  }

  updateQuote(id: string, quote: Quote): Observable<Quote> {
    return this.http
      .put<Quote>(`${environment.apiUrl}/quotes/${id}`, quote)
      .pipe(
        tap(() => {
          this.loadQuotes();
        })
      );
  }

  updateStatus(id: string, status: string): Observable<Quote> {
    return this.http
      .patch<Quote>(`${environment.apiUrl}/quotes/${id}`, { status })
      .pipe(
        tap(() => {
          this.loadQuotes();
        })
      );
  }

  deleteQuote(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/quotes/${id}`).pipe(
      tap(() => {
        this.loadQuotes();
      })
    );
  }

  convertToInvoice(id: string) {
    return this.http
      .post(`${environment.apiUrl}/quotes/${id}/convert-to-invoice`, {})
      .pipe
      // tap(() => {
      // this.loadQuotes();
      // })
      ();
  }

  get currentQuotes(): Quote[] {
    return this.quotesSubject.value;
  }
}
