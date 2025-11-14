import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Invoice } from '../models/invoice.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  public invoices$ = this.invoicesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadInvoices(): void {
    this.getAllInvoices().subscribe((invoices) => {
      this.invoicesSubject.next(invoices);
    });
  }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${environment.apiUrl}/invoices`);
  }

  getInvoiceById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${environment.apiUrl}/invoices/${id}`);
  }

  convertQuoteToInvoice(quoteId: string): Observable<Invoice> {
    return this.http
      .post<Invoice>(
        `${environment.apiUrl}/invoices/convert-quote/${quoteId}`,
        {}
      )
      .pipe(
        tap(() => {
          this.loadInvoices();
        })
      );
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http
      .post<Invoice>(`${environment.apiUrl}/invoices`, invoice)
      .pipe(
        tap(() => {
          this.loadInvoices();
        })
      );
  }

  markAsPaid(
    id: string,
    payload: { paidDate: Date | null }
  ): Observable<Invoice> {
    return this.http
      .patch<Invoice>(
        `${environment.apiUrl}/invoices/${id}/mark-as-paid`,
        payload
      )
      .pipe(
        tap(() => {
          this.loadInvoices();
        })
      );
  }

  updateStatus(id: string, status: string): Observable<Invoice> {
    return this.http
      .patch<Invoice>(`${environment.apiUrl}/invoices/${id}/status`, { status })
      .pipe(
        tap(() => {
          this.loadInvoices();
        })
      );
  }

  deleteInvoice(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/invoices/${id}`).pipe(
      tap(() => {
        this.loadInvoices();
      })
    );
  }

  get currentInvoices(): Invoice[] {
    return this.invoicesSubject.value;
  }
}
