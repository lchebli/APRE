/**
 * Author: Leslie Khattarchebli
 * Date: January 25, 2026
 * File: sales.service.ts
 * Description: Service to fetch sales data from API
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  getRegions(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/reports/sales/regions`);
  }

  getSalesByRegion(region: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/reports/sales/regions/${region}`);
  }

  // Assuming there's a general sales data endpoint
  getSalesData(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/reports/sales`);
  }
}