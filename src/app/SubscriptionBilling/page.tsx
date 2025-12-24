"use client";

import React, { useState } from "react";
import {
  Check,
  Crown,
  Zap,
  Rocket,
  Clock,
} from "lucide-react";

import Layout from "@/components/Layout";
import PaymentModal from "@/components/PaymentModal";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  icon: React.ReactNode;
  features: string[];
  buttonText: string;
  buttonStyle: string;
  popular?: boolean;
  gradient: string;
}

interface Subscription {
  planId: string;
  planName: string;
  status: "active" | "cancelled" | "expired";
  startDate: string;
  nextBillingDate: string;
  price: number;
}

export default function SubscriptionBillingPage() {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription>({
    planId: "free",
    planName: "Free",
    status: "active",
    startDate: "2024-01-01",
    nextBillingDate: "2024-12-31",
    price: 0,
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] =
    useState<"monthly" | "yearly">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "/month",
      icon: <Zap className="w-8 h-8 text-white" />,
      features: [
        "Basic profile listing",
        "Basic coupons",
        "Limited payouts",
        "Standard map visibility",
      ],
      buttonText: "Current Plan",
      buttonStyle:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
      gradient: "from-slate-400 to-slate-500",
    },
    {
      id: "pro",
      name: "Pro",
      price: 39,
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
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "elite",
      name: "Elite",
      price: 99,
      period: "/month",
      icon: <Rocket className="w-8 h-8 text-white" />,
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
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const getToday = () => new Date().toISOString().split("T")[0];

  const getNextBillingDate = (cycle: "monthly" | "yearly") => {
    const date = new Date();
    if (cycle === "monthly") date.setMonth(date.getMonth() + 1);
    else date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split("T")[0];
  };

  const calculatePrice = (basePrice: number, cycle: "monthly" | "yearly") => {
    return cycle === "yearly" ? basePrice * 12 * 0.8 : basePrice;
  };

  const handlePlanSelection = (plan: Plan) => {
    if (plan.id === currentSubscription.planId) return;
    setSelectedPlan(plan);

    plan.id === "free"
      ? setShowConfirmationModal(true)
      : setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));

    setCurrentSubscription({
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      status: "active",
      startDate: getToday(),
      nextBillingDate: getNextBillingDate(billingCycle),
      price: calculatePrice(selectedPlan.price, billingCycle),
    });

    setIsProcessing(false);
    setShowPaymentModal(false);
    setSelectedPlan(null);
    alert(`Successfully upgraded to ${selectedPlan.name}!`);
  };

  const handleDowngrade = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));

    setCurrentSubscription({
      planId: "free",
      planName: "Free",
      status: "active",
      startDate: getToday(),
      nextBillingDate: "2099-12-31",
      price: 0,
    });

    setIsProcessing(false);
    setShowConfirmationModal(false);
    setSelectedPlan(null);
    alert("Successfully downgraded to Free plan!");
  };

  const isCurrentPlan = (plan: Plan) =>
    plan.id === currentSubscription.planId;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-5 py-6 space-y-8">
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-6 text-white shadow">
          <div className="flex justify-between">
            <div>
              <h3 className="opacity-90">Current Plan</h3>
              <h2 className="text-3xl font-bold">
                {currentSubscription.planName}
              </h2>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                Next billing
              </div>
              <p className="font-semibold">
                {new Date(
                  currentSubscription.nextBillingDate
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center gap-2">
          {["monthly", "yearly"].map((c) => (
            <button
              key={c}
              onClick={() => setBillingCycle(c as any)}
              className={`px-6 py-2 rounded ${
                billingCycle === c
                  ? "bg-teal-500 text-white"
                  : "bg-white border"
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-xl p-6 ${
                isCurrentPlan(plan)
                  ? "border-teal-500 shadow"
                  : "border-gray-200"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${plan.gradient}`}
              >
                {plan.icon}
              </div>

              <h3 className="text-center text-xl font-bold">
                {plan.name}
              </h3>

              <p className="text-center text-3xl font-bold mt-2">
                $
                {billingCycle === "yearly" && plan.price
                  ? (plan.price * 12 * 0.8).toFixed(0)
                  : plan.price}
                <span className="text-sm text-gray-500">
                  /{billingCycle}
                </span>
              </p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 text-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrentPlan(plan)}
                onClick={() => handlePlanSelection(plan)}
                className={`mt-6 w-full py-3 rounded font-semibold ${
                  isCurrentPlan(plan)
                    ? "bg-gray-100 text-gray-400"
                    : plan.buttonStyle
                }`}
              >
                {isCurrentPlan(plan)
                  ? "Current Plan"
                  : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          billingCycle={billingCycle}
          isProcessing={isProcessing}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {showConfirmationModal && (
        <ConfirmationModal
          title="Downgrade to Free?"
          message="Premium features will be removed immediately."
          isProcessing={isProcessing}
          onConfirm={handleDowngrade}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </Layout>
  );
}
