const Joi = require('@hapi/joi');

const loginSchema = async function (req, res, next) {
  const data = req.body;
  const schema = Joi.object().keys({
    email: Joi.string().min(8).max(15).required().error(errors => {
      errors.forEach(err => {
        switch (err.type) {
          case "any.empty":
            err.message = "Value should not be empty!";
            break;
          case "string.min":
            err.message = `Value should have at least ${err.context.limit} characters!`;
            break;
          case "string.max":
            err.message = `Value should have at most ${err.context.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    password: Joi.string().min(8).required()
  });

  // validate the request data against the schema
  Joi.validate(data, schema, { abortEarly: false }, (err, value) => {
    if (err) {
      // send a 422 error response if validation fails
      return res.status(422).json({
        status: 'error',
        message: err.message,
        data: data
      });
    }
  });
  next();
}

const forgetPasswordSchema = async function (req, res, next) {
  const data = req.body;
  const schema = Joi.object().keys({
    email: Joi.string().required()
  });
  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(422).json({
        status: 'error',
        message: err.message,
        data: data
      });
    }
  });
  next();
}

const setNewPasswordSchema = async function (req, res, next) {
  const data = req.body;
  const schema = Joi.object().keys({
    new_password: Joi.string().min(6).required(),
    reset_password_token: Joi.string().required(),
  });
  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(422).json({
        status: 'error',
        message: err.message,
        data: data
      });
    }
  });
  next();
}

const addInspectorSchema = async function (req, res, next) {
  const data = req.body;
  const schema = Joi.object().keys({
    user_name: Joi.string().required(),
    // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    email: Joi.string().required(),
    mobile_number: Joi.string().required(),
  });
  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(422).json({
        status: 'error',
        message: err.message,
        data: data
      });
    }
  });
  next();
}

module.exports = {
  loginSchema,
  forgetPasswordSchema,
  setNewPasswordSchema,
  addInspectorSchema
}