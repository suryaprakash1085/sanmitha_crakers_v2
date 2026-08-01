import { useEffect, useState, useCallback } from "react";
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

/** Dispatch this after saving company details so Navbar/Footer refresh instantly. */
export function notifyCompanyChanged() {
  window.dispatchEvent(new Event("company-changed"));
}

export function useCompany() {
  const [company, setCompany] = useState<CompanyData>(empty);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    api
      .get<{ data: any }>("/company")
      .then((res) => {
        if (res.data) setCompany(normalize(res.data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
    window.addEventListener("company-changed", fetch);
    return () => window.removeEventListener("company-changed", fetch);
  }, [fetch]);

  return { company, loading };
}
