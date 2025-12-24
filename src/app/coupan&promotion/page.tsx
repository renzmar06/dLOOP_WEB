'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Zap, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import CreatePromotionModal from '@/app/coupan&promotion/CreatePromotionModal';

export default function CouponsPromotionsDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coupons & Promotions</h1>
              <p className="text-gray-600 mt-1">Create offers that attract customers and boost engagement</p>
            </div>
            <button 
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Create New Promotion
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-teal-500 text-white rounded-2xl p-6">
              <p className="text-teal-100 text-sm">Active Promotions</p>
              <p className="text-4xl font-bold mt-2">2</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm">Total Impressions</p>
              <p className="text-4xl font-bold mt-2">13,920</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm">Total Redemptions</p>
              <p className="text-4xl font-bold mt-2">244</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm">Est. Cost (7 days)</p>
              <p className="text-4xl font-bold mt-2 text-teal-600">$860.80</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button className="pb-3 px-1 text-teal-600 border-b-2 border-teal-600 font-medium">Active Promotions</button>
            <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">Scheduled</button>
            <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">Expired</button>
            <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">Drafts</button>
          </div>

          {/* Promotion Cards */}
          <div className="space-y-6">
            {/* Aluminum Bonus Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="bg-teal-100 p-3 rounded-xl">
                      <Zap className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">+10¢/lb Aluminum Bonus</h3>
                      <p className="text-gray-600 mt-1">Extra cash for all aluminum materials this week</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">Flat Bonus</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">10¢/lb</span>
                        <span className="text-gray-600 text-sm">12/1/2025 - 12/15/2025</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div>
                    <p className="text-gray-500 text-sm">Impressions</p>
                    <p className="text-2xl font-bold mt-1">3,420</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Views</p>
                    <p className="text-2xl font-bold mt-1">1,230</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Redemptions</p>
                    <p className="text-2xl font-bold mt-1">87</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Est. Cost</p>
                    <p className="text-2xl font-bold mt-1 text-teal-600">$142.50</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      7-Day Trend
                    </div>
                    <div className="w-32 h-12 bg-teal-50 rounded-lg flex items-end justify-end pr-2 pb-1">
                      <TrendingUp className="w-8 h-8 text-teal-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Zap className="w-4 h-4" />
                      Boost
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* First-Time Visitor Bonus Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="bg-teal-100 p-3 rounded-xl">
                      <Zap className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">First-Time Visitor Bonus</h3>
                      <p className="text-gray-600 mt-1">$5 welcome bonus for new customers</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">First-Time</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">$5</span>
                        <span className="text-gray-600 text-sm">12/1/2025 - 12/31/2025</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div>
                    <p className="text-gray-500 text-sm">Impressions</p>
                    <p className="text-2xl font-bold mt-1">8,920</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Views</p>
                    <p className="text-2xl font-bold mt-1">2,840</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Redemptions</p>
                    <p className="text-2xl font-bold mt-1">157</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Est. Cost</p>
                    <p className="text-2xl font-bold mt-1 text-teal-600">$718.30</p>
                  </div>
                </div>

                <div className="flex justify-end items-center mt-8 gap-3">
                  <button className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Zap className="w-4 h-4" />
                    Boost
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
      {/* Modal */}
      <CreatePromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}