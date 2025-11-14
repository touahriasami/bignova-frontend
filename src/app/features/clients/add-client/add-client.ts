import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientsService } from '../../../core/services/clients.service';
import { Client } from '../../../core/models/client.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-client',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-client.html',
  styleUrl: './add-client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddClient {
  successMessage: string = '';
  loading: boolean = false;

  addClientForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  constructor(private readonly clientsService: ClientsService) {}

  addClient() {
    if (this.addClientForm.valid) {
      this.loading = true;
      this.clientsService
        .createClient(this.addClientForm.value as Client)
        .subscribe({
          next: () => {
            this.successMessage = 'client add successfully';
            this.addClientForm.reset();
            this.loading = false;
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (error) => {
            this.loading = false;
          },
        });
    }
  }
}
