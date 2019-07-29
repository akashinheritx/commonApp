const { body } = require('express-validator');

//validate user form detail
exports.register_validator = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required.')
    .isEmail().withMessage('Please enter valid email')
    .trim(),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required.')
    .trim()
    .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
    .withMessage("Your password should be 8 characters long and should contain at least one character with uppercase and lowercase, one number and one special character.")
    // .isLength({ min: 8 })
    // .withMessage('Password must have atleast 8 letters.')
    ,  
  body('user_type')
    .not()
    .isEmpty()
    .withMessage('User_type is required.')
    .matches(/^[1-3]/)
    .withMessage('User_type must be 1 or 2 or 3.')
    .trim(),
  body('first_name')
    .not()
    .isEmpty()
    .withMessage('First name is required.')
    .trim()
    .isAlpha()
    .withMessage('Please enter valid first name')
    .isLength({ min: 2, max: 16 })
    .withMessage('First name must have atleast 2 and maximum 16 letters.'),
  body('last_name')
    .not()
    .isEmpty()
    .withMessage('Last name is required.')
    .trim()
    .isAlpha()
    .withMessage('Please enter valid last name')
    .isLength({ min: 2, max: 16 })
    .withMessage('Last name must have atleast 2 and maximum 16 letters.'),
  body('mobile_number')
    .optional()
    .trim()
    .isNumeric()
    .withMessage('Please enter valid mobile number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Length of mobile number should be 10.'),
  body('dob')
    .optional()
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)
    .withMessage('Please enter valid date. Date format must be MM/DD/YYYY'),
  // body('version_number')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Please enter valid version number')
  //   .matches(/^\d+\.\d+\.\d+$/)
  //   .withMessage('Please enter version number in 0.0.0 format.')
];