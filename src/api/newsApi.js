import { cms } from "@api/cmsApi";

export const getNewsFromCms = () => cms.get(`/News-Collections`);
