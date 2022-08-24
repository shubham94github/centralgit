import { validationErrMessages } from "@constants/common";
import { object, string } from "yup";
import { startupLabel } from "./constants";

export const schema = object({
  businessType: string()
    .required(validationErrMessages.email)
    .default(startupLabel)
    .trim(),
  firstName: string()
    .required(validationErrMessages.firstName)
    .default("")
    .trim(),
  lastName: string()
    .required(validationErrMessages.lastName)
    .default("")
    .trim(),
  password: string()
    .required(validationErrMessages.password)
    .default("")
    .trim(),
});
