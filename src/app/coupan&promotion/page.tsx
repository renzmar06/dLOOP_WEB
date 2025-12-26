'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Zap, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import CreatePromotionModal from '@/app/coupan&promotion/CreatePromotionModal';
import { Button } from "@/components/ui/button";
import { fetchPromotions } from '@/redux/slices/promotionsSlice';
import { RootState, AppDispatch } from '@/redux/store';

export default function CouponsPromotionsDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { promotions, loading } = useSelector((state: RootState) => state.promotions);

  useEffect(() => {
    dispatch(fetchPromotions());
  }, [dispatch]);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const formatValue = (bonusType: string, bonusValue: number) => {
    return bonusType === 'percentage' ? `${bonusValue}%` : `$${bonusValue}`;
  };
  return (
    <>
    <Layout>
      <div className="min-h-screen bg-gray-50 ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white flex justify-between items-center mb-8 p-4 border-b border-gray-200 -m-6 ">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coupons & Promotions</h1>
              <p className="text-gray-600 mt-1">Create offers that attract customers and boost engagement</p>
            </div>
             <Button
               variant="yellowbutton"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Create New Promotion
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600  rounded-2xl p-6">
              <p className=" text-sm">Active Promotions</p>
              <p className="text-4xl font-bold mt-2">{promotions.length}</p>
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
  {loading ? (
    <div className="text-center py-8">Loading promotions...</div>
  ) : promotions.length === 0 ? (
    <div className="text-center py-8 text-gray-500">No promotions found</div>
  ) : (
    promotions.map((promotion) => (
    <div
      key={promotion._id}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Main content area with flex row on md+ */}
        <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
          {/* Left side: title, description, tags + status */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-6 md:mb-0">
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 p-3 rounded-xl flex-shrink-0">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{promotion.promotionTitle}</h3>
                  <p className="text-gray-600 mt-1">{promotion.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                      {promotion.choosePromotionType}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                      {formatValue(promotion.bonusType, promotion.bonusValue)}
                    </span>
                    <span className="text-gray-600 text-sm">{formatDateRange(promotion.startDate, promotion.endDate)}</span>
                  </div>
                </div>
              </div>
               <div className="hidden md:block text-right mb-6">
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-xs font-medium">
                Active
              </span>
            </div>
            </div>
            
          </div>

          {/* Right side: stats + status on desktop */}
          <div className="md:w-5/12 lg:w-2/5">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Impressions</p>
                <p className="text-xl md:text-2xl font-bold mt-1">0</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Views</p>
                <p className="text-xl md:text-2xl font-bold mt-1">0</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Redemptions</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{promotion.currentRedemptions}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Est. Cost</p>
                <p className="text-xl md:text-2xl font-bold mt-1 text-teal-600">
                  ${promotion.currentSpend}
                </p>
              </div>
            </div>
             {/* Bottom actions + trend */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-8">
          <div className="flex items-center gap-3 ml-auto">
            <Button variant="secondary">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="yellowbutton">
              <Zap className="w-4 h-4 mr-2" />
              Boost
            </Button>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  ))
  )}
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