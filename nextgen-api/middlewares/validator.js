const Joi = require("joi");

exports.signupSchema = Joi.object({
  email: Joi.string()
    .required()
    .min(6)
    .max(60)
    .email({ tlds: { allow: ["com", "net"] } }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, include uppercase, lowercase, and a digit.",
    }),
});


exports.signinSchema = Joi.object({
  email: Joi.string()
    .required()
    .min(6)
    .max(60)
    .email({ tlds: { allow: ["com", "net"] } }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, include uppercase, lowercase, and a digit.",
    }),
});

exports.acceptCodeSchema = Joi.object({
  email: Joi.string()
    .required()
    .min(6)
    .max(60)
    .email({ tlds: { allow: ["com", "net"] } }),
  providedCode: Joi.number().required(),
})