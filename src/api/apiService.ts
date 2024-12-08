import axios from "axios";

const API_BASE_URL =
  "http://127.0.0.1:5001/lalaba-dev-2fbd7/us-central1/api/admin";

// Generic API handler
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("idToken")}`,
  },
});

export const createAdmin = (data: {
  email: string;
  password: string;
  name: string;
}) => api.post("/create-admin", data);

// Employees
export const addEmployee = (data: any) => api.post("/addEmployee", data);
export const getEmployees = (page: number, limit: number) =>
  api.get(`/employees?page=${page}&limit=${limit}`);
export const updateEmployee = (id: string, data: any) =>
  api.put(`/employees/${id}`, data);
export const deleteEmployee = (id: string) => api.delete(`/employees/${id}`);

// Riders
export const addRider = (data: any) => api.post("/addRider", data);
export const getRiders = (page: number, limit: number) =>
  api.get(`/riders?page=${page}&limit=${limit}`);
export const updateRider = (id: string, data: any) =>
  api.put(`/riders/${id}`, data);
export const deleteRider = (id: string) => api.delete(`/riders/${id}`);

// Shop Owners
export const addShopOwner = (data: any) => api.post("/addShopOwner", data);
export const getShopOwners = (page: number, limit: number) =>
  api.get(`/shopOwners?page=${page}&limit=${limit}`);
export const updateShopOwner = (id: string, data: any) =>
  api.put(`/shopOwners/${id}`, data);
export const deleteShopOwner = (id: string) => api.delete(`/shopOwners/${id}`);

//counts
export const getEmployeeCount = () => api.get("/employees/count");
export const getRiderCount = () => api.get("/riders/count");
export const getShopOwnerCount = () => api.get("/shopOwners/count");
