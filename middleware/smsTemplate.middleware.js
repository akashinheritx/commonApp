const { body } = require('express-validator');

//validate user form detail
exports.smsTemplate_validator = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must have atleast 3 letters.'),  
  body('keys')
    .not()
    .isEmpty()
    .withMessage('Keys are required.')
    .trim(),
  body('subject')
    .not()
    .isEmpty()
    .withMessage('Subject is required.')
    .trim()
    .isLength({ min: 2, max: 16 })
    .withMessage('Subject must have atleast 2 and maximum 16 letters.'),
  body('body')
    .not()
    .isEmpty()
    .withMessage('Body is required.')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Body must have html value.'),
  body('status')
    .not()
    .isEmpty()
    .withMessage('Status is required.')
    .trim()
    .isNumeric()
    .withMessage('Please enter valid Status'),  
];