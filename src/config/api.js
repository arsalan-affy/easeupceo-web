// import axios from "axios";
// const BASE_URL = "https://refferal.affyclouditsolutions.com";
// // const BASE_URL = "http://103.69.91.237:8001";
// // const BASE_URL = "https://refer.aumsecurities.in";


// export const API_URL = `${BASE_URL}/api/`;

// export const LOGIN = `${API_URL}admin/login`;
// export const ALL_USERS = `${API_URL}admin/users/list`;
// export const REGISTER_USER = `${API_URL}user/register`;
// export const VALID_COUPON = `${API_URL}user/validate-referral`;
// export const CUSTOMER_DATA = `${API_URL}user/referrals`;
// export const CHANGE_STATUS = `${API_URL}admin/users/status`;
// export const USER_DATA = `${API_URL}user/referral-owner`;
// export const SEND_OTP = `${API_URL}admin/password/send-otp`;
// export const VERIFY_OTP = `${API_URL}admin/password/verify-otp`;
// export const CHANGE_PASSWORD = `${API_URL}admin/password/reset`;
// export const ANALYTICS = `${API_URL}admin/analytics`;
// export const SEND_SINGLE = `${API_URL}admin/send-single-sms`;
// export const SEND_BULK = `${API_URL}admin/send-bulk-sms`;
// export const SEND_USER_OTP = `${API_URL}user/send-otp`
// export const VERIFY_USER_OTP = `${API_URL}user/verify-otp`


// const AUTH_WHITELIST = [LOGIN, VALID_COUPON, SEND_OTP, CHANGE_PASSWORD];
// const USER_WHITELIST = [SEND_USER_OTP, VERIFY_USER_OTP];


// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const fullUrl = `${config.baseURL}${config.url}`;
//     if (!AUTH_WHITELIST.includes(fullUrl)) {
//       const token = localStorage.getItem("accessToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem("refreshToken");

//       if (!refreshToken) {
//         console.error("No refresh token found. Logging out.");
//         localStorage.clear();
//         window.location.href = "/app/login";
//         return Promise.reject(error);
//       }

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token) => {
//               originalRequest.headers["Authorization"] = "Bearer " + token;
//               resolve(apiClient(originalRequest));
//             },
//             reject: (err) => {
//               reject(err);
//             },
//           });
//         });
//       }

//       isRefreshing = true;

//       return new Promise(async (resolve, reject) => {
//         try {
//           const res = await axios.post(REFRESH_TOKEN_URL, {
//             refresh_token: refreshToken,
//           });

//           const newAccessToken = res.data.meta.access_token;
//           const newRefreshToken = res.data.meta.refresh_token;

//           localStorage.setItem("accessToken", newAccessToken);
//           localStorage.setItem("refreshToken", newRefreshToken);
//           apiClient.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${newAccessToken}`;

//           processQueue(null, newAccessToken);

//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//           resolve(apiClient(originalRequest));
//         } catch (err) {
//           processQueue(err, null);
//           localStorage.clear();
//           window.location.href = "/app/login";
//           reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       });
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;




import axios from "axios";

// const BASE_URL = "https://refferal.affyclouditsolutions.com";
const BASE_URL = "https://refer.aumsecurities.in";

export const API_URL = `${BASE_URL}/api/`;

/* --------------------- API ENDPOINTS --------------------- */
export const LOGIN = `${API_URL}admin/login`;
export const ALL_USERS = `${API_URL}admin/users/list`;
export const REGISTER_USER = `${API_URL}user/register`;
export const VALID_COUPON = `${API_URL}user/validate-referral`;
export const CUSTOMER_DATA = `${API_URL}user/referrals`;
export const ADMIN_CUSTOMER_DATA = `${API_URL}admin/referrals`;
export const CHANGE_STATUS = `${API_URL}admin/users/status`;
export const USER_DATA = `${API_URL}admin/referral-owner`;
export const CUSTOMER_USER_DATA = `${API_URL}user/referral-owner`;
export const SEND_OTP = `${API_URL}admin/password/send-otp`;
export const VERIFY_OTP = `${API_URL}admin/password/verify-otp`;
export const CHANGE_PASSWORD = `${API_URL}admin/password/reset`;
export const ANALYTICS = `${API_URL}admin/analytics`;
export const SEND_SINGLE = `${API_URL}admin/send-single-sms`;
export const SEND_BULK = `${API_URL}admin/send-bulk-sms`;
export const EXPIRED_LIST = `${API_URL}admin/user/expired-list`
export const SERVICE_TOGGLE = `${API_URL}admin/toggle-service`
export const SERVICE_GET = `${API_URL}admin/get-service-data`
export const SERVICE_STATUS = `${API_URL}service`




/* ✅ Customer OTP APIs */
export const SEND_USER_OTP = `${API_URL}user/send-otp`;
export const VERIFY_USER_OTP = `${API_URL}user/verify-otp`;
export const CUSTOMER_REFER= `${API_URL}user/referrals`
export const CUSTOMER_PROFILE= `${API_URL}user/profile`


/* ✅ Admin Routes that don't need token */
const ADMIN_AUTH_WHITELIST = [
  LOGIN,
  SEND_OTP,
  VERIFY_OTP,
  CHANGE_PASSWORD,
];

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* --------------------- HELPERS --------------------- */

const isCustomerApi = (url) => url.includes("/user/");
const isAdminApi = (url) => url.includes("/admin/");

/* --------------------- REQUEST INTERCEPTOR --------------------- */
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;

    // ✅ Customer token usage
    if (isCustomerApi(fullUrl)) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // ✅ Admin token usage (except whitelist)
    if (isAdminApi(fullUrl) && !ADMIN_AUTH_WHITELIST.includes(fullUrl)) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* --------------------- RESPONSE INTERCEPTOR --------------------- */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const fullUrl = `${originalRequest.baseURL}${originalRequest.url}`;

    /* ✅ CUSTOMER API — DO NOT REDIRECT ON 401 */
    if (isCustomerApi(fullUrl)) {
      return Promise.reject(error);
    }

    /* ✅ ADMIN 401 HANDLING STARTS HERE */
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      isAdminApi(fullUrl)
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log("No refresh token found, logging out admin.");
        localStorage.clear();
        window.location.href = "/app/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`${API_URL}admin/refresh-token`, {
            refresh_token: refreshToken,
          });

          const newAccessToken = res.data.meta.access_token;
          const newRefreshToken = res.data.meta.refresh_token;

          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          resolve(apiClient(originalRequest));
        } catch (err) {
          processQueue(err, null);
          localStorage.clear();
          window.location.href = "/app/login";
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    /* Normal error */
    return Promise.reject(error);
  }
);

export default apiClient;
