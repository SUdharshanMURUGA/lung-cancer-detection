import axios, { AxiosError } from "axios";
import type {
  ApiErrorResponse,
  HistoryListResponse,
  PredictionResponse,
} from "@/types/prediction";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
});

/** Extracts a human-readable message from a failed API call, whatever shape the error takes. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.data?.detail) {
      return axiosError.response.data.detail;
    }
    if (axiosError.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }
    if (!axiosError.response) {
      return "Couldn't reach the prediction service. Check your connection and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const { data } = await apiClient.get<{ status: string; model_loaded: boolean }>("/health", {
      timeout: 8_000,
    });
    return data.status === "ok" && data.model_loaded === true;
  } catch {
    return false;
  }
}

export async function predictImage(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<PredictionResponse>("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchHistory(): Promise<HistoryListResponse> {
  const { data } = await apiClient.get<HistoryListResponse>("/history");
  return data;
}

export async function deleteHistoryItem(id: string): Promise<void> {
  await apiClient.delete(`/history/${id}`);
}
