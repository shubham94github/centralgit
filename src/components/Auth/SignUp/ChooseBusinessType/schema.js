import { validationErrMessages } from "@constants/common";
import { boolean, object, string } from "yup";
import { startupLabel } from "./constants";
import {
  PASSWORD_LENGTH,
  ERROR_MESSAGE_LENGTH_SIGN_UP,
} from "@constants/validationMessages";
import {
  MIN_INPUT_LENGTH,
  MAX_INPUT_LENGTH,
} from "@constants/validationConstants";
import { validatePassword } from "@utils/validation";

export const schema = object({
  businessTypeName: string()
    .required("select a business type")
    .default("")
    .trim(),
  firstName: string()
    .required("Please enter your first name")
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .trim()
    .default(""),
  lastName: string()
    .required("Please enter your last name")
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .default("")
    .trim(),
  password: string()
    .required("Please enter the password")
    .test(validatePassword("password"))
    .min(MIN_INPUT_LENGTH, PASSWORD_LENGTH)
    .max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
    .default("")
    .trim(),
  companyLegalName: string()
    .required("Please enter the company name ")
    .max(100, "Company name should not be longer then 100 characters")
    .min(3, "company name should be larger then 3 characters"),
  email: string().trim().default(""),
  emailDomain: string().default(""),
  isCompany: string().oneOf(["false", "true"]).default("false"),
  policyConfirmed: boolean()
    .required("Required")
    .oneOf([true, false])
    .default(false),
});
