import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyEnum } from '../../core/enums/currency.enum';
import { NgFor, NgForOf } from '@angular/common';
import { CompanyService } from '../../core/services/company.service';
import { CompanyModel } from '../../core/models/company.model';

@Component({
  selector: 'app-company',
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './company.html',
  styleUrl: './company.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Company implements OnInit {
  loading = false;
  submitted = false;
  successMessage = '';
  companyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    currency: new FormControl<CurrencyEnum>(CurrencyEnum.EUR),
    iban: new FormControl(''),
    raisonSociale: new FormControl(''),
  });

  currencies = Object.values(CurrencyEnum);

  ngOnInit(): void {
    this.loadCompany();
  }

  constructor(private readonly companyService: CompanyService) {}

  loadCompany(): void {
    this.companyService.company$.subscribe((company) => {
      if (company) {
        this.companyForm.patchValue(company);
      }
    });
    this.companyService.loadCompany();
  }

  get f() {
    return this.companyForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.companyForm.invalid) {
      return;
    }

    this.loading = true;
    this.companyService
      .updateCompany(this.companyForm.value as CompanyModel)
      .subscribe({
        next: () => {
          this.successMessage = 'Company settings updated successfully';
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
