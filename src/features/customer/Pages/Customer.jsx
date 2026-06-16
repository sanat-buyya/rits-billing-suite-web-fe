import React, { useState, useRef, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlass,
  FaTrash,
  FaPenToSquare,
  FaUserGroup,
  FaPhone,
  FaEnvelope,
  FaTag,
  FaLocationDot,
  FaUser,
  // FaLocationDot,
  FaArrowRotateLeft,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomers,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../customerThunk";
import Spinner from "../../../components/Spinner";
import AppToast from "../../../services/toastService";
import CustomerTableSkeleton from "./CustomerTableSkeleton";
import {
  addCustomerToState,
  updateCustomerToState,
  deleteCustomerFromState,
} from "../customerSlice";
import State from "../../../components/State";

const Customer = () => {
  const {
    customers,
    customersLoading,
    searchCustomerLoading,
    customersPage,
    totalPages,
    nextPage,
    createCustomerLoading,
    updateCustomerLoading,
    deleteCustomerLoading,
    // deleteCustomer,
  } = useSelector((state) => state.customer);
  // console.log("totalpages", totalPages, nextPage);

  const dispatch = useDispatch();
  const formRef = useRef(null);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [id, setId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const isFirstRender = useRef(true);

  // Single useEffect to handle both normal fetch and search

  const validateForm = () => {
    let newErrors = {};
    if (!customerName.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    if (gst && gst.length !== 15) newErrors.gst = "GST must be 15 characters";
    // if (!state.trim()) newErrors.state = "State is required";
    // if (!pinCode.trim()) newErrors.pincode = "Pincode is required";
    // else if (!/^\d{6}$/.test(pinCode))
    //   newErrors.pincode = "Pincode must be 6 digits";
    if (pinCode && pinCode.length !== 6) newErrors.pinCode = " Pincode must be 6 digits";
    return newErrors;
  };

  const handleReset = () => {
    setCustomerName("");
    setPhone("");
    setEmail("");
    setGst("");
    setState("");
    setPinCode("");
    setAddress("");
    setErrors({});
    setId(null);
  };

  useEffect(() => {
    // setPage(customersPage)
    dispatch(getCustomers(page));
  }, [dispatch, page, totalPages]);

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmedSearch = searchTerm.trim();

    const timeout = setTimeout(() => {
      if (trimmedSearch.length > 3) {
        // Perform search if more than 3 chars
        dispatch(searchCustomers({ searchInput: trimmedSearch }));
      } else if (trimmedSearch.length === 0) {
        // Reset to first page when cleared
        dispatch(getCustomers(1));
      }
      // else: do nothing if between 1–3 chars
    }, 400);

    // Cleanup timeout on unmount or change
    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(customerName, phone, email, gst, state, pinCode, address);
    const validationErrror = validateForm();
    setErrors(validationErrror);

      if (Object.keys(validationErrror).length > 0) {
    const firstErrorKey = Object.keys(validationErrror)[0];
    setTimeout(() => {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }, 100);
    return; // Stop execution if invalid
  }
    try {
      if (Object.keys(validationErrror).length == 0) {
        // console.log("0 errors");
        const customerData = {
          fullName: customerName,
          phone: phone,
          email: email,
          gstNumber: gst,
          state: state,
          pinCode: pinCode,
          fullAddress: address,
        };
        let result;
        if (id == null) {
          result = await dispatch(createCustomer(customerData)).unwrap();
          // console.log(result);
          dispatch(addCustomerToState(result?.data));
        } else {
          // console.log("from else part")
          result = await dispatch(
            updateCustomer({
              customerId: id,
              customerData,
            })
          ).unwrap();
          dispatch(
            updateCustomerToState({
              customerId: id,
              customerData,
            })
          );
        }
        if (result) {
          AppToast.showSuccess(
            id ? "Customer updated successfully" : "Customer Added successfully"
          );
        }
        handleReset();
      }
    } catch (err) {
      console.log(err);
      AppToast.showError(err.error)
    }
  };

  const handleEdit = (customer) => {
    // console.log("handdle  edit clicked", customer);
    setId(customer._id);
    setCustomerName(customer.fullName);
    setPhone(customer.phone);
    setEmail(customer.email);
    setGst(customer.gstNumber);
    setState(customer.state);
    setPinCode(customer.pinCode);
    setAddress(customer.fullAddress);

    //  Scroll to the form section
    if (formRef.current) {
    formRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  };

  const handleDelete = async (id, Cname) => {
    setDeletingCustomerId(id);
    if (window.confirm(`Are you sure you want to delete ${Cname}?`)) {
      try {
        await dispatch(deleteCustomer(id))
          .unwrap()
          .then((res) => {
            dispatch(deleteCustomerFromState(id));
            // console.log(page);
            // if (res) {
            //   console.log(customers?.length);
            // }
            if (customers?.length <= 1) {
              setPage((pre) => (pre > 1 ? pre - 1 : 1));
            }
            AppToast.showSuccess("customer Deleted successfully");
          });
      } catch (err) {
        AppToast.showError(err.message || "failed to delete customers");
        console.log(err);
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* CUSTOMER FORM */}
      <div
        className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6"
        ref={formRef}
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaUser className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                {id ? "Update Customer" : "Add Customer"}
              </h2>
              <p className="text-sm text-gray-500">
                {id ? "Modify customer details" : "Enter customer information"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            // disabled={isSubmitting}
            className="flex items-center justify-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-md transition text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowRotateLeft />
            <span>Reset</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                name="name"
                  type="text"
                  value={customerName}
                  // onChange={(e) => setCustomerName(e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
                    setCustomerName(formatted);
                  }}
                  placeholder="Enter customer name"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="phone"
                  type="number"
                  value={phone}
                  maxLength={10}
                  // onChange={(e) => setPhone(e.target.value)}
                  onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                  setPhone(val);
                }}
                  placeholder="Enter 10-digit phone number"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }
                  [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* GST */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <div className="relative">
                <FaTag className="absolute left-3 top-3 text-gray-400" />
                <input
                name="gst"
                  type="text"
                  value={gst}
                  maxLength={15}
                  onChange={(e) => setGst(e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.gst
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                />
              </div>
              {errors.gst && (
                <p className="text-red-500 text-xs mt-1">{errors.gst}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <State  name="state" value={state} onChange={(e) => setState(e.target.value)} error={errors.state}/>
              {/* <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                  errors.state
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
              >
                <option value="">Select State</option>
                <option value="Bihar">Bihar</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select> */}
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <div className="relative">
                <FaLocationDot className="absolute left-3 top-3 text-gray-400" />
                <input
                name="pincode"
                  type="number"
                  value={pinCode}
                  maxLength={6}
                  // onChange={(e) => setPinCode(e.target.value)}
                  onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 6) val = val.slice(0, 6);
                  setPinCode(val);
                }}
                  placeholder="Enter 6-digit pincode"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.pinCode
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }
                  [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none`}
                />
              </div>
              {errors.pinCode && (
                <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
              )}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address"
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="submit"
              disabled={createCustomerLoading || updateCustomerLoading}
              className="px-6 py-2.5 bg-[#0a1628] hover:bg-gray-700 text-white font-medium rounded-md transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {/* condition ? expression_if_true : expression_if_false */}
                  {(createCustomerLoading || updateCustomerLoading) ? (<Spinner size={16} color="#FFFFFF" /> ) 
                    : id ? (<FaPenToSquare className="text-sm" />) : (<span className="text-lg font-semibold">+</span>
                    )}
                </span>
              {/* {isSubmitting ? (
                <>
                  <Spinner size="small" />
                  {id ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{id ? "Update Customer" : "Add Customer"}</>
              )} */}
              {(createCustomerLoading || updateCustomerLoading) ? (
                <>{id ? "Updating..." : "Adding..."}</>
              ) : (
                <>{id ? "Update Customer" : "Add Customer"}</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CUSTOMER LIST */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaUserGroup className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Customer List
              </h2>
              <p className="text-sm text-gray-500">
                {customers?.length} customers found
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <FaMagnifyingGlass className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              placeholder="Search customers by Phone number"
              value={searchTerm}
              // onChange={(e) => {
              //   setSearchTerm(e.target.value);
              //   // setPage(1);
              // }}
              onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                  setSearchTerm(val);
                }}
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
              [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {(customersLoading || searchCustomerLoading) && (
          <div>
            <CustomerTableSkeleton rows={7} mobileRows={6} />
          </div>
        )}

        {!customersLoading &&
          !searchCustomerLoading &&
          customers?.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FaUserGroup className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No customers found.</p>
            </div>
          )}

        {/* Mobile Card View */}
        {!customersLoading &&
          !searchCustomerLoading &&
          customers?.length > 0 && (
            <>
              <div className="sm:hidden space-y-3">
                {customers?.map((customer) => (
                  <div
                    key={customer._id}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                  >
                    <h3 className="font-semibold text-gray-900 text-base mb-2">
                      {customer.fullName}
                    </h3>

                    <div className="space-y-1.5 mb-3">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaPhone className="text-gray-400" /> {customer.phone}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />{" "}
                        {customer.email}
                      </p>
                      {customer.gstNumber && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaTag className="text-gray-400" />{" "}
                          {customer.gstNumber}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaLocationDot className="text-gray-400" />{" "}
                        {customer.state} - {customer.pinCode}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(customer)}
                        disabled={deletingCustomerId === customer._id}
                        className="text-blue-600 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaPenToSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(customer._id, customer.fullName)
                        }
                        disabled={deletingCustomerId === customer._id}
                        className="text-red-600 bg-white shadow-sm hover:shadow-md hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingCustomerId === customer._id ? (
                          <Spinner size="small" />
                        ) : (
                          <>
                            <FaTrash className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto border border-gray-100 rounded-lg min-h-[300px] max-h-[400px]">
                <table className="w-full text-sm text-left text-gray-700 border-collapse min-w-full ">
                  <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-10 py-3 font-semibold">GST</th>
                      <th className="px-4 py-3 font-semibold">State</th>
                      <th className="px-4 py-3 font-semibold">Pincode</th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers?.map((customer) => (
                      <tr
                        key={customer._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {customer.fullName}
                        </td>
                        <td className="px-4 py-3">{customer.phone}</td>
                        <td className="px-4 py-3">{customer.email}</td>
                        <td className="px-4 py-3">
                          {customer.gstNumber ? (
                            <span className="px-2 py-1  text-green-700 text-xs rounded-md font-mono">
                              {customer.gstNumber}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {customer.state ? (
                            <span>{customer.state}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {customer.pinCode ? (
                            <span>{customer.pinCode}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(customer)}
                              disabled={deletingCustomerId === customer._id}
                              className="text-blue-600 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaPenToSquare className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(customer._id, customer.fullName)
                              }
                              disabled={deletingCustomerId === customer._id}
                              className="text-red-600 bg-white shadow-sm hover:shadow-md hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed " //min-w-[80px]
                            >
                              {deletingCustomerId === customer._id ? (
                                <Spinner size="small" />
                              ) : (
                                <>
                                  <FaTrash className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                  {/* Prev Button */}
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md border transition ${
                      page <= 1
                        ? "text-gray-400 cursor-not-allowed border-gray-200"
                        : "text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    <FaChevronLeft className="w-3 h-3" /> Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1 items-center">
                    {/* First Page */}
                    <button
                      onClick={() => setPage(1)}
                      className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md transition ${
                        page === 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      1
                    </button>

                    {/* First Ellipsis */}
                    {page > 4 && <span className="px-1 text-gray-400">...</span>}

                    {/* Pages around current */}
                    {(() => {
                      const pages = [];
                      const start = Math.max(2, page - 1);
                      const end = Math.min(totalPages - 1, page + 1);
                      
                      for (let i = start; i <= end; i++) {
                        // Skip if it would duplicate first or last page
                        if (i === 1 || i === totalPages) continue;
                        
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md transition ${
                              page === i
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}

                    {/* Last Ellipsis */}
                    {page < totalPages - 3 && <span className="px-1 text-gray-400">...</span>}

                    {/* Last Page */}
                    {totalPages > 1 && (
                      <button
                        onClick={() => setPage(totalPages)}
                        className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md transition ${
                          page === totalPages
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(p + 1, totalPages))
                    }
                    className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md border transition ${
                      page >= totalPages
                        ? "text-gray-400 cursor-not-allowed border-gray-200"
                        : "text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    Next <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};

export default Customer;
