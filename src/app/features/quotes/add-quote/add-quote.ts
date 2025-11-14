import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientsService } from '../../../core/services/clients.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { Observable, of } from 'rxjs';
import { Client } from '../../../core/models/client.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Quote } from '../../../core/models/quote.model';

@Component({
  selector: 'app-add-quote',
  imports: [ReactiveFormsModule, NgFor, NgIf, AsyncPipe],
  templateUrl: './add-quote.html',
  styleUrl: './add-quote.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddQuote {
  successMessage: string = '';
  loading: boolean = false;

  @Input() clients$: Observable<Client[]> = of([]);

  addQuoteForm = new FormGroup({
    clientId: new FormControl('', [Validators.required]),
    items: new FormArray([]),
  });

  constructor(
    private readonly clientsService: ClientsService,
    private readonly quotesService: QuotesService
  ) {
    // Start with one blank item row
    this.addItem();
  }

  items(): FormArray {
    return this.addQuoteForm.get('items') as FormArray;
  }

  private newItemGroup(): FormGroup {
    return new FormGroup({
      description: new FormControl('', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      unitPriceHT: new FormControl(0, [Validators.required, Validators.min(0)]),
      tvaRate: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
    });
  }

  addItem(): void {
    this.items().push(this.newItemGroup());
  }

  removeItem(index: number): void {
    this.items().removeAt(index);
  }

  addQuote() {
    if (this.addQuoteForm.valid) {
      this.loading = true;
      this.quotesService.createQuote(this.addQuoteForm.value as any).subscribe({
        next: () => {
          this.successMessage = 'quote add successfully';
          this.addQuoteForm.reset();
          // Recreate the form to have an initial blank item
          this.addQuoteForm.setControl('items', new FormArray([]));
          this.addItem();
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
