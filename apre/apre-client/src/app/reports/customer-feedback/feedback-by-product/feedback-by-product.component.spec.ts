/**
 * Author: Leslie Khattarchebli
 * Date: 8 February 2026
 * File: feedback-by-product.component.spec.ts
 * Description: Unit tests for feedback by product component
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FeedbackByProductComponent, FeedbackByProduct } from './feedback-by-product.component';
import { environment } from '../../../../environments/environment';

describe('FeedbackByProductComponent', () => {
  let component: FeedbackByProductComponent;
  let fixture: ComponentFixture<FeedbackByProductComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackByProductComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackByProductComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: Verify component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Verify component loads and displays data correctly from API
  it('should load and display customer feedback data by product on initialization', () => {
    const mockData: FeedbackByProduct[] = [
      {
        product: 'Product A',
        averageRating: 4.5,
        feedbackCount: 10,
        totalRating: 45
      },
      {
        product: 'Product B',
        averageRating: 3.8,
        feedbackCount: 5,
        totalRating: 19
      }
    ];

    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-product`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(component.feedbackData).toEqual(mockData);
    expect(component.feedbackData.length).toBe(2);
    expect(component.errorMessage).toBe('');
  });

  // Test 3: Verify component displays appropriate message when no data exists
  it('should display error message when no feedback data is available', () => {
    const mockData: FeedbackByProduct[] = [];

    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-product`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(component.feedbackData).toEqual([]);
    expect(component.errorMessage).toBe('No feedback data available for products');
  });

  // Test 4: Verify component handles HTTP errors gracefully
  it('should handle HTTP error and display error message', () => {
    const errorMessage = 'Failed to load customer feedback data. Please try again later.';

    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-product`);
    expect(req.request.method).toBe('GET');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    expect(component.feedbackData).toEqual([]);
    expect(component.errorMessage).toBe(errorMessage);
  });
});
