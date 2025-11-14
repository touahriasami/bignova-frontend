import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Client } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-update-client',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './update-client.html',
  styleUrl: './update-client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateClient implements OnChanges {
  @Input() client: Client | null = null;

  loading = false;
  successMessage = '';

  updateClientForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(private readonly clientsService: ClientsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client) {
      this.updateClientForm.patchValue({
        name: this.client.name || '',
        email: this.client.email || '',
        phone: this.client.phone || '',
        address: this.client.address || '',
      });
    }
  }

  save(): void {
    if (!this.client?._id || this.updateClientForm.invalid) {
      return;
    }
    this.loading = true;
    this.clientsService
      .updateClient(this.client._id, this.updateClientForm.value as Client)
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Client updated successfully';
          setTimeout(() => {
            this.successMessage = '';
            (
              document.getElementById('updateClient') as HTMLDialogElement
            )?.close();
          }, 1200);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
