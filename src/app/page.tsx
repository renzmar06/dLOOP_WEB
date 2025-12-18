import Layout from "@/components/Layout";


export default function Home() {
  
  return (
    <Layout>
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to CycleIQ</h1>
        <p className="text-gray-600">
          Your recycling operations management system is ready to use.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
          <p className="text-gray-600">View your system overview and key metrics.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Management</h3>
          <p className="text-gray-600">Manage your team and staff permissions.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory</h3>
          <p className="text-gray-600">Track and manage your recycling inventory.</p>
        </div>
      </div>
    </div>
    </Layout>
  );
}
