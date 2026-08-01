import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface CompanyData {
  id: number;
  company_name: string;
  gst_number: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  website: string;
  description: string;
}

const empty: CompanyData = {
  id: 0,
  company_name: "",
  gst_number: "",
  address: "",
  phone: "",
  email: "",
  logo: "",
  website: "",
  description: "",
};

// Normalize nulls from DB to empty strings
function normalize(raw: any): CompanyData {
  return {
    ...empty,
    ...raw,
    logo: raw?.logo ?? "",
    website: raw?.website ?? "",
    description: raw?.description ?? "",
  };
}

export function useCompany() {
  const [company, setCompany] = useState<CompanyData>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: any }>("/company")
      .then((res) => {
        if (res.data) setCompany(normalize(res.data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { company, loading };
}
