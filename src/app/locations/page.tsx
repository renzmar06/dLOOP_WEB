import type { Metadata } from "next";
import LocationsDashboard from "@/components/locations/LocationsDashboard";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Locations Dashboard",
  description: "Add, edit, and manage your business locations.",
};

export default function LocationsPage(): React.ReactElement {
  return (
    <Layout>
      <LocationsDashboard />
    </Layout>
  );
}
