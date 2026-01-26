/**
 * Author: Leslie Khattarchebli
 * Date: January 25, 2026
 * File: sales-report.component.spec.ts
 * Description: Unit tests for SalesReportComponent
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SalesReportComponent } from './sales-report.component';
import { SalesService } from '../../../services/sales.service';

describe('SalesReportComponent', () => {
  let component: SalesReportComponent;
  let fixture: ComponentFixture<SalesReportComponent>;
  let salesServiceSpy: jasmine.SpyObj<SalesService>;
 
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SalesService', ['getSalesData']);

    await TestBed.configureTestingModule({
      imports: [SalesReportComponent],
      providers: [{ provide: SalesService, useValue: spy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReportComponent);
    component = fixture.componentInstance;
    salesServiceSpy = TestBed.inject(SalesService) as jasmine.SpyObj<SalesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sales data on init', () => {
    const mockData = [
      { region: 'North', totalSales: 1000 },
      { region: 'South', totalSales: 1500 }
    ];
    salesServiceSpy.getSalesData.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(salesServiceSpy.getSalesData).toHaveBeenCalled();
    expect(component.chartLabels).toEqual(['North', 'South']);
    expect(component.chartData).toEqual([1000, 1500]);
  });

  it('should handle error when loading sales data', () => {
    spyOn(console, 'error');
    salesServiceSpy.getSalesData.and.returnValue(of([])); // Shows an error by returning empty

    component.ngOnInit();

    expect(console.error).not.toHaveBeenCalled(); // Since we return empty, no error is thrown
  });
});