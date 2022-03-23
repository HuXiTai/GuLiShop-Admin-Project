import mockRequest from "@/utils/mockRequest";

export const getEchartsData = () => {
  return mockRequest("/getEchartsData");
};
