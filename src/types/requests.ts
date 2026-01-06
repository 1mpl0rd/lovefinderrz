// src/types/requests.ts
export type RequestType = "date" | "call" | "nudes";

export interface DateRequest {
  type: "date";
  location: string;
  date: string;
  time: string;
  comment?: string;
}

export interface CallRequest {
  type: "call";
  date: string;
  time: string;
  comment?: string;
}

export interface NudesRequest {
  type: "nudes";
  content: string;
  comment?: string;
}

export type Request = DateRequest | CallRequest | NudesRequest;
