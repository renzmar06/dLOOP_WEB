"use client";

import React from "react";
import { Check, Crown, Zap, Rocket } from "lucide-react";
import Layout from "@/components/Layout";

export default function SubscriptionBillingPage() {
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
                  Subscription &amp; Billing
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your plan, payment methods, and invoices
                </p>
              </div>
            </div>
          </header>

          {/* Choose Your Plan */}
          <div>
            <h2 className="text-xl font-bold mb-2 pl-5">Choose Your Plan</h2>
            <p className="text-gray-600 mb-6 pl-5">
              Select the plan that best fits your business needs
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-xl border-2 p-6 relative ${
                    plan.popular
                      ? "border-teal-500"
                      : "border-gray-200 hover:border-teal-500"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center ${
                        plan.name === "Pro"
                          ? "from-emerald-500 to-teal-500"
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
                        <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
