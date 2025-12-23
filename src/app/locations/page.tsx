// src/app/locations/page.tsx
import { Metadata } from 'next';
import LocationsDashboard from "@/components/locations/LocationsDashboard";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: 'Locations Dashboard',
  description: 'Add, edit, and manage your business locations.',
};

export default function LocationsPage() {
  return (
    <Layout>
      <LocationsDashboard />
    </Layout>
  );
}