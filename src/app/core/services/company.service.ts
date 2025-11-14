import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CompanyModel } from '../models/company.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private companySubject = new BehaviorSubject<CompanyModel | null>(null);
  public company$ = this.companySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCompany();
  }

  loadCompany(): void {
    this.getCompany().subscribe((company) => {
      this.companySubject.next(company);
    });
  }

  getCompany(): Observable<CompanyModel> {
    return this.http.get<CompanyModel>(`${environment.apiUrl}/company`);
  }

  updateCompany(company: CompanyModel): Observable<CompanyModel> {
    return this.http
      .patch<CompanyModel>(`${environment.apiUrl}/company`, company)
      .pipe(
        tap((updatedCompany) => {
          this.companySubject.next(updatedCompany);
        })
      );
  }

  get currentCompany(): CompanyModel | null {
    return this.companySubject.value;
  }
}
