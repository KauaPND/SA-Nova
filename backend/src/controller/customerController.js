// src/controllers/customerController.js
import customerService from '../services/customerService.js';

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const getCustomerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerDetails = await customerService.getCustomerDetails(id);
    res.json(customerDetails);
  } catch (error) {
    next(error);
  }
};

export const getCustomerAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const analytics = await customerService.getCustomerAnalytics(id);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};