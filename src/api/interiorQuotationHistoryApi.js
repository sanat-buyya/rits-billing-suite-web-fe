import axiosInstance from "./axiosInstance";

const interiorQuotationHistoryApi = {};

interiorQuotationHistoryApi.getInteriorQuotationHistoryData = async (
  search = "",
  page = 1,
  limit = 10
) => {
  const response = await axiosInstance.get(
    `/quotation2/interior-quotations?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
  );
  return response.data;
};


export default interiorQuotationHistoryApi;