const { body } = require('express-validator');

//validate user form detail
exports.version_validator = [
  body('versionNumber')
    .not()
    .isEmpty()
    .withMessage('Please enter valid version number')
    .matches(/^\d+\.\d+\.\d+$/)
    .withMessage('Please enter version number in 0.0.0 format.')
    .trim(),
  body('deviceType')
    .not()
    .isEmpty()
    .withMessage('Device type is required.')
    .isAlpha()
    .withMessage('Please enter valid device type')
    .trim(),
  body('isForceUpdate')
    .not()
    .isEmpty()
    .withMessage('Force update value is required.')
    .isNumeric()
    .withMessage('Please enter valid force update value')
    .matches(/^[0-1]/)
    .withMessage('Force update value must be 0 or 1.')
    .trim(),
];