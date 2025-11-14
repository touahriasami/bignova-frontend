import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClientsService } from '../../core/services/clients.service';
import { Observable, of, BehaviorSubject, combineLatest, map } from 'rxjs';
import { Client } from '../../core/models/client.model';
import { AddClient } from './add-client/add-client';
import { UpdateClient } from './update-client/update-client';

@Component({
  selector: 'app-clients',
  imports: [NgFor, AsyncPipe, AddClient, NgIf, UpdateClient],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clients implements OnInit {
  loading: boolean = false;
  selectedClientId: string | null = null;
  clients$: Observable<Client[]> = of([]);
  editClientData: Client | null = null;
  filteredClients$: Observable<Client[]> = of([]);
  private searchTerm$ = new BehaviorSubject<string>('');
  constructor(private readonly clientsService: ClientsService) {}

  ngOnInit(): void {
    this.clients$ = this.clientsService.clients$;
    this.clientsService.loadClients();

    this.filteredClients$ = combineLatest([
      this.clients$,
      this.searchTerm$,
    ]).pipe(
      map(([clients, term]) => {
        const t = term.toLowerCase().trim();
        if (!t) return clients;
        return clients.filter((c) => {
          const name = (c.name || '').toLowerCase();
          const email = (c.email || '').toLowerCase();
          const phone = (c.phone || '').toLowerCase();
          return name.includes(t) || email.includes(t) || phone.includes(t);
        });
      })
    );
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm$.next(value);
  }

  editClient(client: Client): void {
    this.editClientData = client;
    (document.getElementById('updateClient') as HTMLDialogElement)?.show();
  }

  deleteClient(clientId: string): void {
    this.selectedClientId = clientId;
    this.loading = true;
    this.clientsService.deleteClient(clientId)?.subscribe(() => {
      this.loading = false;
    });
  }
}
