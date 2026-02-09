/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/channel-rating-by-month', (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, 'month and channel are required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /rating-by-date-range-and-channel', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /feedback-by-product
 *
 * Added: February 8, 2026
 Fetches customer feedback data grouped by average rating for each product. This endpoint combines all customer feedback entries in the customerFeedback collection, groups them by product, and averages rating for each product. The results are sorted by highly rated to lowest.

  * Example: fetch('/feedback-by-product') will return a JSON array of products with their average rating, feedback count, and total rating.

 */
router.get('/feedback-by-product', (req, res, next) => {
  try {
    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        // 1: Groups all feedback by product and calculate the average rating, count of feedback entries, and total rating for each product
        {
          $group: {
            _id: '$product',
            averageRating: { $avg: '$rating' },
            feedbackCount: { $sum: 1 },
            totalRating: { $sum: '$rating' }
          }
        },
        // 2: Reshape the data and round the average rating to 2 decimal places for better readability
        {
          $project: {
            _id: 0,
            product: '$_id',
            averageRating: { $round: ['$averageRating', 2] },
            feedbackCount: 1,
            totalRating: 1
          }
        },
        //3: Sort by average rating in descending order (highest rated first)
        {
          $sort: {
            averageRating: -1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /feedback-by-product', err);
    next(err);
  }
});

module.exports = router;