import Layout from '@/components/Layout';

export default function BusinessProfile() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Manage your business profile here.</p>
        </div>
      </div>
    </Layout>
  );
}