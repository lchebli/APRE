/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the customer feedback API
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

// Test the customer feedback API
describe('Apre Customer Feedback API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the channel-rating-by-month endpoint
  it('should fetch average customer feedback ratings by channel for a specified month', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              channels: ['Email', 'Phone'],
              ratingAvg: [4.5, 3.8]
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/customer-feedback/channel-rating-by-month?month=1'); // Send a GET request to the channel-rating-by-month endpoint

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        channels: ['Email', 'Phone'],
        ratingAvg: [4.5, 3.8]
      }
    ]);
  });

  // Test the channel-rating-by-month endpoint with missing parameters
  it('should return 400 if the month parameter is missing', async () => {
    const response = await request(app).get('/api/reports/customer-feedback/channel-rating-by-month'); // Send a GET request to the channel-rating-by-month endpoint with missing month
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'month and channel are required',
      status: 400,
      type: 'error'
    });
  });

  // Test the channel-rating-by-month endpoint with an invalid month
  it('should return 404 for an invalid endpoint', async () => {
    // Send a GET request to an invalid endpoint
    const response = await request(app).get('/api/reports/customer-feedback/invalid-endpoint');
    expect(response.status).toBe(404); // Expect a 404 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });

  // Added: February 8, 2026 - Test the new feedback-by-product endpoint
  // Test 1: Verify the endpoint successfully fetches and combines feedback data by product
  it('should fetch customer feedback data grouped by product', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
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
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/customer-feedback/feedback-by-product');

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
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
    ]);
  });

  // Test 2: Verify the endpoint handles empty data cleanly
  it('should return an empty array when no feedback data exists', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/customer-feedback/feedback-by-product');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test 3: Verify the endpoint handles database errors properly
  it('should handle database errors gracefully for feedback-by-product', async () => {
    mongo.mockImplementation(async (callback, next) => {
      const error = new Error('Database connection failed');
      next(error);
    });

    const response = await request(app).get('/api/reports/customer-feedback/feedback-by-product');
    expect(response.status).toBe(500);
    expect(response.body.type).toBe('error');
  });
});