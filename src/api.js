import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api/";

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {"Content-Type": "application/json"},
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

//Signup
export const signup = async (userData) => {
    try {
        const response = await axiosInstance.post('user/register/', userData);
        return response.data
    } catch (error) {
        console.error("Signup error: ", error.response?.data || error.message);
        return {error:error.response?.data || "Signup Failed"};
    }
}

//login
export const login = async (credentials) => {
    try {
        const respone = await axiosInstance.post('user/login/', credentials);

        localStorage.setItem('access_token', respone.data.access_token);
        localStorage.setItem('refresh_token', respone.data.refresh_token);
        localStorage.setItem('is_superuser', respone.data.is_superuser);
        localStorage.setItem('role', respone.data.role);
        return respone.data;
    } catch (error) {
        console.error("Login error: ", error.response?.data || error.message);

    // Extract all possible error messages
    const errorData = error.response?.data?.error || {};

    const errorMessage =
      errorData.message ||   // If 'message' key exists
      errorData.AuthorizationError ||  // If 'AuthorizationError' key exists
      errorData.detail ||  // Django default error message key
      "Login Failed.";   // Fallback error message

    return { error: errorMessage };
    }
}

//Logout
export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_superuser');
    window.location.href = '/login';
}