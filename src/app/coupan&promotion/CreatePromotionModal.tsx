'use client';

import React, { useState } from 'react';
import { X, Percent, DollarSign, Users, RotateCcw, UserPlus, Clock, Gift } from 'lucide-react';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const promotionTypes = [
  {
    id: 'percentage',
    title: 'Percentage Bonus',
    description: 'Extra % on material payouts',
    icon: Percent,
    color: 'text-green-600 bg-green-100 border-green-300',
    selected: true,
  },
  {
    id: 'flat',
    title: 'Flat Payout Bonus',
    description: 'Fixed dollar amount bonus',
    icon: DollarSign,
    color: 'text-blue-600 bg-blue-100 border-blue-300',
  },
  {
    id: 'first-time',
    title: 'First-Time Visitor',
    description: 'Welcome bonus for new customers',
    icon: UserPlus,
    color: 'text-purple-600 bg-purple-100 border-purple-300',
  },
  {
    id: 'returning',
    title: 'Returning Customer',
    description: 'Reward loyal customers',
    icon: RotateCcw,
    color: 'text-orange-600 bg-orange-100 border-orange-300',
  },
  {
    id: 'referral',
    title: 'Referral Coupon',
    description: 'Both referrer and friend get bonus',
    icon: Users,
    color: 'text-pink-600 bg-pink-100 border-pink-300',
  },
  {
    id: 'happy-hour',
    title: 'Happy Hour',
    description: 'Time-based special offer',
    icon: Clock,
    color: 'text-indigo-600 bg-indigo-100 border-indigo-300',
  },
];

export default function CreatePromotionModal({ isOpen, onClose }: CreatePromotionModalProps) {
  const [selectedType, setSelectedType] = useState('percentage');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Promotion</h2>
            
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            {[1, 2, 3, 4, 5].map((step, i) => (
              <React.Fragment key={step}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step === 1
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {i < 4 && <div className="w-16 h-1 bg-gray-200 mx-2" />}
              </React.Fragment>
            ))}
          </div>

          <p className="text-gray-600 mb-8">Choose promotion type</p>

          {/* Promotion Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {promotionTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex justify-end">
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-between items-center">
            <button className="text-gray-600 hover:text-gray-900">Material-Specific</button>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="hidden lg:block w-1/2 bg-gray-900 p-12 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            
            <h3 className="text-white text-lg font-medium flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-500" />
              Live Preview
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-400 mb-12">How customers will see this promotion</p>

          {/* Phone Mockup */}
          <div className="relative mx-auto w-80">
            <div className="bg-black rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="bg-teal-500 text-white p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-medium opacity-80">Aluminum</h4>
                </div>

                {/* Promotion Card */}
                <div className="bg-gradient-to-br from-teal-400 to-teal-500 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-3">Your Promotion Title</h2>
                  <p className="text-white text-opacity-90 mb-6">
                    Promotion description will appear here
                  </p>
                  <button className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow">
                    Redeem Now
                  </button>
                </div>

                {/* Nearby Locations */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2l-1.5 3H4l3.5 2.5-1.5 3L10 11l3.5 2.5-1.5-3L15.5 8h-4.5L10 2z" />
                    </svg>
                    More Nearby Locations
                  </p>
                  <div className="space-y-2">
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm">Other Location 1 <span className="text-gray-500">1.5 mi</span></div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm">Other Location 2 <span className="text-gray-500">2.0 mi</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}