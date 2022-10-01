import { invalidCompanyNameErrMsg } from "@components/Auth/constants";
import { object, string, bool } from "yup";
import {
  PASSWORD_LENGTH,
  ERROR_MESSAGE_LENGTH_SIGN_UP,
} from "@constants/validationMessages";
import {
  MIN_INPUT_LENGTH,
  MAX_INPUT_LENGTH,
} from "@constants/validationConstants";
import { validateCompanyName, validatePassword } from "@utils/validation";
import { validationErrMessages } from "@constants/common";

export const baseSchema = {
  email: string()
    .required("E-mail is a required")
    .email("Invalid e-mail")
    .default("")
    .trim(),
  password: string()
    .required("Please enter the password")
    .test(validatePassword("password"))
    .min(MIN_INPUT_LENGTH, PASSWORD_LENGTH)
    .max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
    .default("")
    .trim(),
  firstName: string()
    .required("Please enter first name")
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .trim()
    .default(""),
  lastName: string()
    .required("Please enter last name")
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .default("")
    .trim(),

  policyConfirmed: bool()
    .required("Required")
    .oneOf([true, false])
    .default(false),

  // emailDomain: string().default("").trim(),
};

export const schemaRetailer = object({
  ...baseSchema,
  companyLegalName: string()
    .test("", invalidCompanyNameErrMsg, validateCompanyName)
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .default("")
    .trim(),
});

// export const schemaStartup = object({
//   ...baseSchema,
//   companyLegalName: string()
//     .required(validationErrMessages.legalCompanyName)
//     .test("", invalidCompanyNameErrMsg, validateCompanyName)
//     .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
//     .default("")
//     .trim(),
// });

export const schemaStartup = object({
  ...baseSchema,
  startup: string()
    .required("Startup name is required")
    .test("", invalidCompanyNameErrMsg, validateCompanyName)
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .default("")
    .trim(),
  website: string()
    .required("website is required")
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url"
    )
    .default("")
    .trim(),
  phone: string()
    .required("Phone Number is required")
    .default("")
    .trim()
    .nullable(),
});
