/**
 * Author: Leslie Khattarchebli
 * Date: January 25, 2026
 * File: sales-report.component.ts
 * Description: Component to display sales report using chart
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../../services/sales.service';
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
    <div class="sales-report">
      <h1>Sales Report</h1>
      @if (chartData.length > 0) {
        <app-chart
          [type]="'bar'"
          [label]="'Total Sales'"
          [data]="chartData"
          [labels]="chartLabels">
        </app-chart>
      } @else {
        <p>Loading sales data...</p>
      }
    </div>
  `,
  styles: [`
    .sales-report {
      padding: 20px;
    }
  `]
})
export class SalesReportComponent implements OnInit {
  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.salesService.getSalesData().subscribe({
      next: (data: any[]) => {
        // Assuming data is array of {region: string, totalSales: number}
        this.chartLabels = data.map(item => item.region);
        this.chartData = data.map(item => item.totalSales);
      },
      error: (err) => {
        console.error('Error loading sales data:', err);
      }
    });
  }
}