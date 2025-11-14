import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClientsService } from '../../core/services/clients.service';
import { Observable, of } from 'rxjs';
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
  constructor(private readonly clientsService: ClientsService) {}

  ngOnInit(): void {
    this.clients$ = this.clientsService.clients$;
    this.clientsService.loadClients();
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
