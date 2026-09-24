const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  cta_text: string;
  cta_link: string;
  created_at?: string;
}

export interface QuizAnswers {
  minat: string;
  tujuan: string;
  gaya_berkarya: string;
}

export interface QuizSubmitRequest {
  answers: QuizAnswers;
  name?: string;
  visitor_id?: string;
}

export interface RecommendedProgram {
  id: string;
  title: string;
  category: string;
  description: string;
  score: number;
  match_reasons: string[];
  cta_text: string;
  cta_link: string;
}

export type Recommendation = RecommendedProgram;

export interface QuizSubmitResponse {
  submission_id: string;
  recommendations: RecommendedProgram[];
}

export interface InterestDistributionItem {
  interest: string;
  count: number;
}

export interface StatsResponse {
  total_submissions: number;
  top_program?: string | null;
  interest_distribution: InterestDistributionItem[];
  top_interest?: string | null;
  most_recommended_program?: string | null;
  popular_interests?: { minat: string; count: number }[];
}

export interface ActivityItem {
  id: string;
  kind: string;
  label: string;
  interest: string;
  program_title: string;
  created_at: string;
}

/**
 * Fetch catalog of programs from backend. Checks response.ok and throws on failure.
 */
export async function getPrograms(): Promise<Program[]> {
  const response = await fetch(`${API_BASE_URL}/api/programs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorDetail = "Gagal memuat program";
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export async function submitQuizAnswers(
  payload: QuizSubmitRequest,
  token: string
): Promise<QuizSubmitResponse> {
  const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = "Gagal mengirim kuis";
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorDetail = "Gagal memuat statistik";
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  return response.json();
}
