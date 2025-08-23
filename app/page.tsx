import { Agreement } from "@/lib/types";
import { getAgreementStats } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import ClientMainPage from "@/app/ClientMainPage";

async function getAgreements(): Promise<Agreement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(process.env.DATABASE_TABLE_NAME!)
    .select("*");

  if (error) {
    console.error("Error fetching agreements:", error);
    return [];
  }

  // Transform the data to match frontend naming conventions
  return (
    data?.map((item) => ({
      ...item,
      sourceUrl: item.source_url,
      jurisdictionStatuses: item.jurisdiction_statuses,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) || []
  );
}

export const revalidate = 3600;

export default async function MainPage() {
  const agreements = await getAgreements();
  const stats = getAgreementStats(agreements);

  return (
    <div className="min-h-screen bg-[#f6ebe3]">
      <ClientMainPage initialAgreements={agreements} initialStats={stats} />
    </div>
  );
}
