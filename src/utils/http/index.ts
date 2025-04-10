import { MetaT } from "@/types/meta";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "../api";

/**
 * Standard API response interface for all HTTP requests
 * @template T - The type of data expected in the response
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: MetaT;
  token?: string;
  error?: string | Record<string, unknown>;
}

/**
 * Handles Axios errors and transforms them into a standardized ApiResponse format
 * @template T - The type of data expected in the response
 * @param error - The error object caught from the API request
 * @returns Standardized API response with error details
 */
export const handleAxiosError = <T>(error: unknown): ApiResponse<T> => {
  let errorMessage = "Something went wrong. Please try again.";
  let errorDetails: string | Record<string, unknown> = "";

  if (error instanceof AxiosError) {
    if (error.response) {
      errorMessage =
        (error.response.data as { message?: string })?.message || errorMessage;
      errorDetails =
        (error.response.data as { error?: string | Record<string, unknown> })
          ?.error ||
        error.response.data ||
        "";
    } else if (error.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return {
    success: false,
    message: errorMessage,
    error: errorDetails,
    data: null,
  };
};

/**
 * Transforms Axios response into a standardized ApiResponse format
 * @template T - The type of data expected in the response
 * @param response - The Axios response object
 * @returns Standardized API response with success data
 */
const handleResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>,
): ApiResponse<T> => {
  return {
    success: response.data.success,
    message: response.data.message || "Request successful",
    data: response.data.data ?? null,
    meta: response?.data?.meta,
    token: response.data.token,
  };
};

/**
 * HTTP client utility with standardized error handling and response formatting
 * Provides typed request methods for common HTTP operations
 */
const http = {
  /**
   * Performs a GET request
   * @template T - Expected response data type
   * @param url - The endpoint URL
   * @param config - Optional Axios request configuration
   */
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },

  /**
   * Performs a POST request
   * @template T - Expected response data type
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   */
  post: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },

  /**
   * Performs a PUT request
   * @template T - Expected response data type
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   */
  put: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },

  /**
   * Performs a DELETE request
   * @template T - Expected response data type
   * @param url - The endpoint URL
   * @param config - Optional Axios request configuration
   */
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },
};

export default http;
