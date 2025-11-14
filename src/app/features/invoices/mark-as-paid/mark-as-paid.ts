import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InvoicesService } from '../../../core/services/invoices.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-mark-as-paid',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './mark-as-paid.html',
  styleUrl: './mark-as-paid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkAsPaid implements OnInit {
  loading = false;
  @Input() invoiceId: string | null = '';

  markAsPaidForm = new FormGroup({
    selectedDate: new FormControl(null, [Validators.required]),
  });

  constructor(private readonly invoicesService: InvoicesService) {}

  ngOnInit(): void {
    console.log('invoiceId : ', this.invoiceId);
  }

  markAsPaid() {
    if (!this.markAsPaidForm.valid) {
      return;
    }
    this.loading = true;
    this.invoicesService
      .markAsPaid(this.invoiceId!, {
        paidDate: this.markAsPaidForm.get('selectedDate')!.value,
      })
      .subscribe({
        next: () => {
          this.markAsPaidForm.reset();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
