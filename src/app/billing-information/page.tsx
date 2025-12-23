"use client";

import React, { useState } from "react";
import {
  Check,
  CreditCard,
  Crown,
  Download,

  Settings,
  X,
  AlertTriangle,
  Zap,
  Lock,
} from "lucide-react";
import Layout from "@/components/Layout";

export default function SubscriptionBillingPage() {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);

  // Payment form state
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiration, setExpiration] = useState("12/27");
  const [cvc, setCvc] = useState("123");
  const [cardholderName, setCardholderName] = useState("test");
  const [isDefault, setIsDefault] = useState(true);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      icon: <Zap className="w-8 h-8 text-gray-500" />,
      features: [
        "Basic profile listing",
        "Basic coupons",
        "Limited payouts",
        "Standard map visibility",
      ],
      buttonText: "Downgrade to Free",
      buttonStyle:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      name: "Pro",
      price: "$39",
      period: "/month",
      icon: <Crown className="w-8 h-8 text-white" />,
      features: [
        "Unlimited coupons",
        "Advanced analytics",
        "Boost credits included",
        "Gallery photos & videos",
        "Higher payout limits",
        "Event participation",
      ],
      buttonText: "Upgrade to Pro",
      buttonStyle: "bg-teal-500 text-white hover:bg-teal-600",
      popular: true,
    },
    {
      name: "Elite",
      price: "$99",
      period: "/month",
      icon: (
        <div className="w-12 h-12 bg-purple-500 rounded flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-white"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
          </svg>
        </div>
      ),
      features: [
        "Everything in Pro",
        "Priority sponsored placement",
        "Advanced customer insights",
        "High-limit payouts",
        "Dedicated account rep",
        "Custom advertising packages",
      ],
      buttonText: "Upgrade to Elite",
      buttonStyle:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    },
  ];



  const billingHistory = [
    {
      date: "12/11/2025",
      invoice: "INV-2025-12",
      plan: "Pro",
      amount: "$39.00",
      status: "Paid",
    },
    {
      date: "11/11/2025",
      invoice: "INV-2025-11",
      plan: "Pro",
      amount: "$39.00",
      status: "Paid",
    },
    {
      date: "10/11/2025",
      invoice: "INV-2025-10",
      plan: "Pro",
      amount: "$39.00",
      status: "Paid",
    },
    {
      date: "9/11/2025",
      invoice: "INV-2025-09",
      plan: "Free",
      amount: "$0.00",
      status: "Paid",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white flex items-center justify-between p-3 border-b border-gray-200 min-h-[75px] shadow-sm">
            <div className="flex items-center space-x-2">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Billing Information
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your plan, payment methods, and invoices
                </p>
              </div>
            </div>
          </header>

          {/* Current Plan */}
          <div className="bg-teal-500 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8" />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">Current Plan: Pro</h2>
                    <span className="bg-teal-400 px-3 py-1 rounded-lg text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-teal-100 mt-1">$39/month</p>
                  <p className="text-teal-100 text-sm">
                    Next billing: January 11, 2026
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPauseModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Pause Subscription
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel Subscription
                </button>
                <button className="bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Change Plan
                </button>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold">Billing History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Invoice #
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Plan
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billingHistory.map((row) => (
                    <tr key={row.invoice}>
                      <td className="py-4 px-6 text-sm">{row.date}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {row.invoice}
                      </td>
                      <td className="py-4 px-6 text-sm">{row.plan}</td>
                      <td className="py-4 px-6 text-sm font-semibold">
                        {row.amount}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-md text-xs font-medium">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Payment Method
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">
                Primary Payment Method
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-mono text-lg">•••• •••• •••• 4242</p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>
                      Expires<br></br> 12/27
                    </span>
                    <span>
                      Card Type<br></br> Credit
                    </span>
                  </div>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                  VISA
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowUpdatePaymentModal(true)}
              className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition mb-4"
            >
              Update Payment Method
            </button>

            <div className="flex gap-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                VISA
              </div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                MC
              </div>
              <div className="bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold">
                AMEX
              </div>
              <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
                ACH
              </div>
            </div>
          </div>

          {/* Pause Subscription Modal */}
          {showPauseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Pause Subscription
                  </h3>
                  <button
                    onClick={() => setShowPauseModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  Your subscription will be paused and you'll retain access
                  until your current billing period ends.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPauseModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                    Pause Subscription
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Subscription Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Cancel Subscription
                  </h3>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 mb-3 text-sm">
                    Are you sure you want to cancel your subscription? You'll
                    lose access to:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Unlimited coupons</li>
                    <li>• Advanced analytics</li>
                    <li>• Boost credits</li>
                    <li>• Gallery photos & videos</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Keep Subscription
                  </button>
                  <button className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Update Payment Method Modal */}
          {showUpdatePaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setShowUpdatePaymentModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Update Payment Method</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration
                      </label>
                      <input
                        type="text"
                        value={expiration}
                        onChange={(e) => setExpiration(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm">
                        Set as default payment
                      </p>
                      <p className="text-xs text-gray-600">
                        Use for all future payments
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDefault(!isDefault)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        isDefault ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          isDefault ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 py-4">
                    <Lock className="w-4 h-4" />
                    <span>
                      Your payment information is encrypted and secure
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Handle save logic here (e.g., API call)
                      setShowUpdatePaymentModal(false);
                    }}
                    className="w-full bg-teal-500 text-white py-4 rounded-lg font-semibold hover:bg-teal-600 transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    Save Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
