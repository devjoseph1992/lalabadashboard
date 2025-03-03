import axios from "axios";
import { auth } from "@/firebase/firebaseConfig";

const API_BASE_URL =
  "https://us-central1-lalaba-dev-2fbd7.cloudfunctions.net/api";

// ✅ Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Attach Firebase Token Before Requests
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("❌ No authenticated user found. Skipping token.");
        return config;
      }

      const idToken = await user.getIdToken();
      console.log("📌 Attaching Firebase Token:", idToken);

      config.headers.Authorization = `Bearer ${idToken}`;
      config.headers["Content-Type"] = "application/json";

      return config;
    } catch (error) {
      console.error("❌ Error fetching Firebase Token:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

export default api;

/**
 * ✅ Utility function to log API calls (for debugging)
 */
const logApiRequest = async (fn: Function, ...params: any) => {
  try {
    console.log("📌 API Request:", JSON.stringify(params, null, 2));
    const response = await fn(...params);
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.data || error);
    throw error;
  }
};

/**
 * ✅ Admin API (Full CRUD for Employees, Riders, Merchants)
 */
export const addAdminUser = (data: any) =>
  logApiRequest(api.post, "/admin/add", data);

export const updateAdminUser = (id: string, data: any) =>
  logApiRequest(api.put, `/admin/update/${id}`, data);

export const deleteAdminUser = (id: string) =>
  logApiRequest(api.delete, `/admin/delete/${id}`);

/**
 * ✅ Employees API (Admin only)
 */
export const getEmployees = (page: number, limit: number, search = "") =>
  logApiRequest(
    api.get,
    `/admin/role/employee?page=${page}&limit=${limit}&search=${search}`
  );

export const addEmployee = (data: any) =>
  logApiRequest(api.post, "/admin/add", { ...data, role: "employee" });

export const updateEmployee = (id: string, data: any) =>
  logApiRequest(api.put, `/admin/update/${id}`, data);

export const deleteEmployee = (id: string) =>
  logApiRequest(api.delete, `/admin/delete/${id}`);

/**
 * ✅ Riders API (Admin & Employee)
 */
export const getRiders = async (
  page: number,
  limit: number,
  search = "",
  role: "admin" | "employee"
) => {
  const endpoint = role === "admin" ? "/admin/role/rider" : "/employees/riders";
  const response = await logApiRequest(
    api.get,
    `${endpoint}?page=${page}&limit=${limit}&search=${search}`
  );

  console.log("📌 API Response:", JSON.stringify(response, null, 2)); // Debugging Log

  // Handle both `users` and `riders` (for different roles)
  const ridersList = response.riders || response.users || [];

  if (!Array.isArray(ridersList)) {
    console.error("❌ Invalid API response structure:", response);
    return { riders: [], pagination: {} };
  }

  return {
    riders: ridersList,
    pagination: response.pagination || {},
  };
};

export const addRider = (data: any, role: "admin" | "employee") => {
  const endpoint = role === "admin" ? "/admin/add" : "/employees/riders/add";
  return logApiRequest(api.post, endpoint, { ...data, role: "rider" });
};

export const updateRider = (id: string, data: any) =>
  logApiRequest(api.put, `/admin/update/${id}`, data);

export const deleteRider = (id: string, role: "admin" | "employee") => {
  if (role === "employee") {
    console.warn("⚠ Employees are not allowed to delete riders.");
    return Promise.reject(new Error("Unauthorized action."));
  }
  return logApiRequest(api.delete, `/admin/delete/${id}`);
};

/**
 * ✅ Merchants API (Admin & Employee)
 */
export const getMerchants = async (
  page: number,
  limit: number,
  search = "",
  role: "admin" | "employee"
) => {
  const endpoint =
    role === "admin" ? "/admin/role/merchant" : "/employees/merchants";
  const response = await logApiRequest(
    api.get,
    `${endpoint}?page=${page}&limit=${limit}&search=${search}`
  );

  console.log("📌 API Response:", JSON.stringify(response, null, 2)); // Debugging Log

  // Handle both `users` and `merchants` (for different roles)
  const merchantsList = response.merchants || response.users || [];

  if (!Array.isArray(merchantsList)) {
    console.error("❌ Invalid API response structure:", response);
    return { merchants: [], pagination: {} };
  }

  return {
    merchants: merchantsList,
    pagination: response.pagination || {},
  };
};

export const addMerchant = async (data: any, role: "admin" | "employee") => {
  try {
    const endpoint =
      role === "admin" ? "/admin/add" : "/employees/merchants/add";

    console.log("📌 API Request Payload:", JSON.stringify(data, null, 2));

    const response = await logApiRequest(api.post, endpoint, {
      ...data,
      role: "merchant",
    });

    console.log("✅ API Response:", response);
    return response;
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.data || error);
    alert(`Error: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    throw error;
  }
};

export const updateMerchant = (id: string, data: any) =>
  logApiRequest(api.put, `/admin/update/${id}`, data);

export const deleteMerchant = (id: string, role: "admin" | "employee") => {
  if (role === "employee") {
    console.warn("⚠ Employees are not allowed to delete merchants.");
    return Promise.reject(new Error("Unauthorized action."));
  }
  return logApiRequest(api.delete, `/admin/delete/${id}`);
};

/**
 * ✅ Counts API (Both Admin & Employees)
 */
export const getEmployeeCount = () =>
  logApiRequest(api.get, "/admin/employees/count");
export const getRiderCount = () =>
  logApiRequest(api.get, "/admin/riders/count");
export const getMerchantCount = () =>
  logApiRequest(api.get, "/admin/merchants/count");
