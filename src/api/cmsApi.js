import axios from "axios";
const { CMS_URL } = process.env;

export const cms = axios.create({ baseURL: CMS_URL });
