import axiosInstance from "./axiosInstance";

const interiorQuotationApi = {};

interiorQuotationApi.createInteriorQuotation = async (payload) => {
  const formData = new FormData();

  //Append normal fields
  Object.entries(payload).forEach(([key, value]) => {
    if (key !== "tableData") {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
  });

  // Clean tableData (remove image objects)
  const cleanedTableData = {
    ...payload.tableData,
    rows: payload.tableData.rows.map((row) => ({
      ...row,
      cells: {
        ...row.cells,
        image: null,
      },
    })),
  };

  formData.append("tableData", JSON.stringify(cleanedTableData));

  //Append images separately
  payload.tableData.rows.forEach((row, index) => {
  if (row.cells.image?.file instanceof File) {
    formData.append(`productImages[${index}]`, row.cells.image.file);
  }
});


  const response = await axiosInstance.post(
    "/quotation2/create-interior-quotation",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default interiorQuotationApi;
