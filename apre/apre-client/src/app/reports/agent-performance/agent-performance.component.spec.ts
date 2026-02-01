/**
 * Agent Performance Component Tests
 * Created: February 1, 2026
 * Purpose: Test the agent performance component functionality
 *
 * Tests included:
 * 1. Component creation - verify component starts correctly
 * 2. Data loading - verify data grabs and updates arrays
 * 3. Chart rendering - verify the chart displays after data has loaded
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AgentPerformanceComponent } from './agent-performance.component';
import { ChartComponent } from '../../shared/chart/chart.component';
import { environment } from '../../../environments/environment';

describe('AgentPerformanceComponent', () => {
  let component: AgentPerformanceComponent;
  let fixture: ComponentFixture<AgentPerformanceComponent>;
  let httpMock: HttpTestingController;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AgentPerformanceComponent, ChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentPerformanceComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Cleanup after each test - ensures all mock requests were handled
  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: Check if component is created successfully
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // Test 2: Check if component fetches data and updates correctly
  // Simulates receiving agent data from the API
  // Verifies that agentNames and agentPerformanceData arrays are filled correctly
  // Verifies that showChart is set to true so the chart displays
  it('should load agent performance data and populate arrays', () => {
    const mockData = [
      { agentId: '1', name: 'Agent A', averagePerformance: 90 },
      { agentId: '2', name: 'Agent B', averagePerformance: 85 }
    ];

    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/dashboard/agent-performance`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    fixture.detectChanges();

    expect(component.agentNames).toEqual(['Agent A', 'Agent B']);
    expect(component.agentPerformanceData).toEqual([90, 85]);
    expect(component.showChart).toBeTrue();
  });

  // Test 3: Check if the chart element appears in the page after data loads
  // Verifies the chart component is rendered in the template
  it('should render chart element after data load', () => {
    const mockData = [
      { agentId: '1', name: 'Agent A', averagePerformance: 90 }
    ];

    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/dashboard/agent-performance`);
    req.flush(mockData);

    fixture.detectChanges();

    const chartElement = debugElement.query(By.directive(ChartComponent));
    expect(chartElement).toBeTruthy();
  });
});
