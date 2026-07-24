export type PredictionClass =
  | "Normal"
  | "Adenocarcinoma"
  | "Squamous cell carcinoma"
  | "Large cell carcinoma";

export type RiskLevel = "Low" | "Elevated" | "High" | "Uncertain";

export interface ClassProbability {
  class_name: PredictionClass;
  probability: number;
}

/** Mirrors backend/app/schemas/prediction.py::PredictionResponse exactly. */
export interface PredictionResponse {
  class: PredictionClass;
  confidence: number;
  prediction_time: string;
  risk_level: RiskLevel;
  description: string;
  probabilities: ClassProbability[];
}

export interface ApiErrorResponse {
  error: string;
  detail: string;
}

/** Mirrors backend/app/schemas/history.py::HistoryItem exactly. */
export interface HistoryItem {
  id: string;
  filename: string;
  class_name: PredictionClass;
  confidence: number;
  risk_level: RiskLevel;
  image_data_url: string;
  created_at: string;
}

export interface HistoryListResponse {
  items: HistoryItem[];
  total: number;
}
