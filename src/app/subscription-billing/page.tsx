"use client";

import React, { useEffect, useState } from "react";
import { Check, Crown, Zap, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  selectPlan,
  fetchSubscriptions,
} from "@/redux/slices/subscriptionBillingSlice";
import Layout from "@/components/Layout";

export default function SubscriptionBillingPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions, isLoading, error } = useSelector(
    (state: RootState) => state.subscriptionBilling
  );
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    dispatch(fetchSubscriptions());
    checkBusinessProfileCompletion();
  }, [dispatch]);

  const checkBusinessProfileCompletion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/business", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const business = data.data[0];
        // Check if required fields are filled
        const isComplete = business.businessName && business.phone && business.email;
        setShowSidebar(isComplete);
      }
    } catch (error) {
      console.error("Failed to check business profile:", error);
    }
  };

  const handlePlanSelect = async (plan: { name: string; price: string }) => {
    try {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      await dispatch(
        selectPlan({
          planName: plan.name,
          planPrice: plan.price,
          planExpiryDate: expiryDate.toISOString(),
        })
      ).unwrap();
      router.push("/business-profile");
    } catch (error) {
      console.error("Failed to select plan:", error);
    }
  };
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      icon: <Zap className="w-8 h-8 text-white" />,
      features: [
        "Basic profile listing",
        "Basic coupons",
        "Limited payouts",
        "Standard map visibility",
      ],
      buttonText: "Downgrade to Free",
      buttonStyle:
        "bg-white border border-gray-300 text-gray-700 bg-slate-100 text-slate-700 hover:bg-slate-200",
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
      buttonStyle:
        "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white",
      popular: true,
    },
    {
      name: "Elite",
      price: "$99",
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
        "bg-white border border-gray-300 text-gray-700 bg-slate-100 text-slate-700 hover:bg-slate-200",
    },
  ];

  const PageContent = () => (
    <div className="flex flex-col h-full">
      {/* Fixed Header - only when no sidebar */}
      {!showSidebar && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-white flex items-center justify-between p-4 border-b border-gray-200 min-h-[75px] shadow-sm">
          <div className="flex items-center space-x-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Choose Your Plan
              </h1>
              <p className="text-sm text-gray-500">
                Select the plan that best fits your business needs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header for sidebar layout */}
      {showSidebar && (
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b border-gray-200 min-h-[75px] shadow-sm">
          <div className="flex items-center space-x-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Choose Your Plan
              </h1>
              <p className="text-sm text-gray-500">
                Select the plan that best fits your business needs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 overflow-auto p-6 ${!showSidebar ? 'pt-[91px]' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl border-2 p-6 relative ${
                  plan.popular
                    ? "border-amber-500"
                    : "border-gray-200 hover:border-amber-500"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center ${
                      plan.name === "Pro"
                        ? "from-amber-400 to-amber-500"
                        : plan.name === "Elite"
                        ? "from-violet-500 to-purple-500"
                        : "from-slate-400 to-slate-500"
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() =>
                    handlePlanSelect({ name: plan.name, price: plan.price })
                  }
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.buttonStyle
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Processing..." : plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return showSidebar ? (
    <Layout>
      <PageContent />
    </Layout>
  ) : (
    <PageContent />
  );
}
