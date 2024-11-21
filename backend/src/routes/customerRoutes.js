const express = require('express');
const { getCustomerHistory, addCustomerHistory } = require('../controller/customerController');
const router = express.Router();

router.get('/', getCustomerHistory);
router.post('/', addCustomerHistory);

module.exports = router;
