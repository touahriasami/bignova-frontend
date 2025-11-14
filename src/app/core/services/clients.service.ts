import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Client } from '../models/client.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  public clients$ = this.clientsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadClients(): void {
    this.getAllClients().subscribe((clients) => {
      this.clientsSubject.next(clients);
    });
  }

  getAllClients(search?: string): Observable<Client[]> {
    let url = `${environment.apiUrl}/clients`;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    return this.http.get<Client[]>(url);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${environment.apiUrl}/clients/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${environment.apiUrl}/clients`, client).pipe(
      tap(() => {
        this.loadClients();
      })
    );
  }

  updateClient(id: string, client: Client): Observable<Client> {
    return this.http
      .patch<Client>(`${environment.apiUrl}/clients/${id}`, client)
      .pipe(
        tap(() => {
          this.loadClients();
        })
      );
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/clients/${id}`).pipe(
      tap(() => {
        this.loadClients();
      })
    );
  }

  get currentClients(): Client[] {
    return this.clientsSubject.value;
  }
}
