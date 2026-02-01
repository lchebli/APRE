/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: agent-performance.component.ts
 * Description: Agent performance component
 */
/**
 * Agent Performance Component
 * Created: February 1, 2026
 * Purpose: Display agent performance data in a bar chart
 *
 * What it does:
 * - Fetches agent data from the API when the page loads
 * - Shows a chart with agent names and their performance scores
 * - Displays a loading message while fetching data
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from '../../shared/chart/chart.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-agent-performance',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
    <div>
      <h1>Agent Performance</h1>

      <div *ngIf="!showChart">Loading...</div>

      <div *ngIf="showChart" class="chart-card">
        <app-chart
          [type]="'bar'"
          [label]="'Agent Average Performance'"
          [data]="agentPerformanceData"
          [labels]="agentNames">
        </app-chart>
      </div>
    </div>
  `,
  styles: ``
})
export class AgentPerformanceComponent implements OnInit {
  // Stores agent names from the API response
  agentNames: string[] = [];

  // Stores performance scores for each agent
  agentPerformanceData: number[] = [];

  // Controls whether the chart is visible (true = show chart, false = show loading)
  showChart = false;

  constructor(private http: HttpClient) {}

  // Runs when the component starts - calls loadAgentPerformance() automatically
  ngOnInit(): void {
    this.loadAgentPerformance();
  }

  // Fetches agent performance data from the backend
  // Calls: GET /api/dashboard/agent-performance
  // Extracts agent names and performance scores into separate arrays
  // Shows the chart once data is received
  loadAgentPerformance(): void {
    this.http.get(`${environment.apiBaseUrl}/dashboard/agent-performance`).subscribe({
      next: (data: any) => {
        this.agentNames = data.map((d: any) => d.name);
        this.agentPerformanceData = data.map((d: any) => d.averagePerformance);
      },
      error: (err: any) => {
        console.error('Error loading agent performance', err);
      },
      complete: () => {
        this.showChart = true;
      }
    });
  }

}
