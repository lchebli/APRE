/**
 * Author: Leslie Khattarchebli
 * Date: 8 February 2026
 * File: feedback-by-product.component.ts
 * Description: Customer feedback by product component
 *
 * This component displays customer feedback data by product.
 * It fetches data from the /api/reports/customer-feedback/feedback-by-product endpoint
 * and displays it using the shared TableComponent.
 *
 * Features:
 * - Displays product name, average rating, feedback count, and total rating
 * - Columns for easy data analysis
 * - Error handling for empty data and failed API requests
 * - Responsive design with loading and error states
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../shared/table/table.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// What the UI will display for each product's:
export interface FeedbackByProduct {
  product: string;          // Product name
  averageRating: number;    // Average customer rating (0-5 scale)
  feedbackCount: number;    // Total number of feedback entries
  totalRating: number;      // Sum of all ratings for this product
}

@Component({
  selector: 'app-feedback-by-product',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <h1>Customer Feedback by Product</h1>
    <div class="feedback-container">
      @if (errorMessage) {
        <div class="message message--error">{{ errorMessage }}</div>
      }

      @if (feedbackData.length > 0) {
        <div class="card table-card">
          <app-table
            [title]="'Customer Feedback by Product'"
            [data]="feedbackData"
            [headers]="headers"
            [sortableColumns]="sortableColumns"
            [headerBackground]="'primary'">
          </app-table>
        </div>
      } @else if (!errorMessage) {
        <div class="message message--info">Loading feedback data...</div>
      }
    </div>
  `,
  styles: `
    .feedback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    .table-card {
      width: 80%;
      margin: 20px 0;
    }

    .message {
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      width: 80%;
      text-align: center;
    }

    .message--error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .message--info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
  `
})
export class FeedbackByProductComponent implements OnInit {
  feedbackData: FeedbackByProduct[] = [];  // Array to store feedback data from API
  headers: string[] = ['product', 'averageRating', 'feedbackCount', 'totalRating'];  // Table column headers
  sortableColumns: string[] = ['product', 'averageRating', 'feedbackCount', 'totalRating'];  // Columns that can be sorted
  errorMessage: string = '';  // Stores error messages to display to user

  constructor(private http: HttpClient) {}

  // Initialize component and load feedback data when component is created
  ngOnInit(): void {
    this.loadFeedbackData();
  }

  // Fetch customer feedback data by product from API
  loadFeedbackData(): void {
    this.http.get<FeedbackByProduct[]>(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-product`).subscribe({
      next: (data: FeedbackByProduct[]) => {
        if (data.length === 0) {
          this.errorMessage = 'No feedback data available for products';
          this.feedbackData = [];
        } else {
          this.feedbackData = data;
          this.errorMessage = '';
        }
      },
      error: (err) => {
        console.error('Error loading feedback data:', err);
        this.errorMessage = 'Failed to load customer feedback data. Please try again later.';
        this.feedbackData = [];
      }
    });
  }
}
