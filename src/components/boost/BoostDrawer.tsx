'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { 
  setStep, 
  setBoostType, 
  setTitle, 
  setBudgetAndDuration, 
  setAudience, 
  setStartDate, 
  setEstimate, 
  setEstimating, 
  setCreating 
} from '@/redux/slices/campaignDraftSlice';
import { createCampaign, getEstimate, updateCampaign } from '@/redux/slices/campaignsSlice';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import Stepper from './Stepper';
import BudgetSlider from './BudgetSlider';
import ResultMetricCard from './ResultMetricCard';
import AudiencePreview from './AudiencePreview';

interface BoostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  boostType: string;
  editingCampaignId?: string | null;
  variant?: 'compact' | 'expanded';
}

export default function BoostDrawer({ isOpen, onClose, boostType, editingCampaignId, variant = 'expanded' }: BoostDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const campaignDraft = useSelector((state: RootState) => state.campaignDraft);
  const currentStep = campaignDraft.step;
  
  const steps = [
    'Choose Boost Target',
    'Budget & Duration',
    'Estimated Results',
    'Audience Targeting'
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (boostType) {
        dispatch(setBoostType(boostType));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, boostType, dispatch]);

  if (!isOpen) return null;

  // Step navigation handlers
  const handleNextStep = () => {
    if (campaignDraft.step < 4) {
      if (campaignDraft.step === 2) {
        // Get estimate when moving to step 3
        handleGetEstimate();
      }
      dispatch(setStep(campaignDraft.step + 1));
    }
  };

  const handlePrevStep = () => {
    if (campaignDraft.step > 1) {
      dispatch(setStep(campaignDraft.step - 1));
    }
  };

  const handleGetEstimate = async () => {
    dispatch(setEstimating(true));
    try {
      const estimateData = {
        boostType: campaignDraft.boostType,
        dailyBudget: campaignDraft.dailyBudget,
        durationDays: campaignDraft.durationDays,
        audienceType: campaignDraft.audienceType,
        radiusKm: campaignDraft.radiusKm
      };
      const result = await dispatch(getEstimate(estimateData)).unwrap();
      dispatch(setEstimate(result));
    } catch (error) {
      console.error('Failed to get estimate:', error);
    } finally {
      dispatch(setEstimating(false));
    }
  };

  const handleLaunch = async () => {
    dispatch(setCreating(true));
    try {
      const campaignData = {
        boostType: campaignDraft.boostType,
        title: campaignDraft.title || `${campaignDraft.boostType} Campaign`,
        dailyBudget: campaignDraft.dailyBudget,
        durationDays: campaignDraft.durationDays,
        isContinuous: campaignDraft.isContinuous,
        audienceType: campaignDraft.audienceType,
        radiusKm: campaignDraft.radiusKm,
        startDate: campaignDraft.startDate
      };
      
      if (editingCampaignId) {
        // Update existing campaign
        console.log('Updating campaign with ID:', editingCampaignId);
        await dispatch(updateCampaign({ id: editingCampaignId, ...campaignData })).unwrap();
      } else {
        // Create new campaign
        await dispatch(createCampaign(campaignData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save campaign:', error);
    } finally {
      dispatch(setCreating(false));
    }
  };

  // Validation logic
  const isStep1Valid = campaignDraft.title !== '';
  const canContinue = campaignDraft.step === 1 ? isStep1Valid : true;

  // Conditional styling based on variant
  const isCompact = variant === 'compact';
  
  const styles = {
    drawer: isCompact ? 'max-w-[480px]' : 'max-w-[520px]',
    header: {
      container: isCompact 
        ? 'bg-white border-b border-gray-200 px-4 py-3 min-h-[56px]' 
        : 'bg-white border-b border-gray-200 px-6 py-4 min-h-[64px]',
      title: isCompact ? 'text-base font-semibold text-gray-900' : 'text-lg font-semibold text-gray-900',
      subtitle: isCompact ? 'text-xs text-gray-500' : 'text-sm text-gray-500',
      closeBtn: isCompact 
        ? 'p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600' 
        : 'p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600',
      closeIcon: isCompact ? 'w-4 h-4' : 'w-5 h-5'
    },
    stepper: isCompact ? 'px-4 py-3 bg-gray-50 relative' : 'px-6 py-4 bg-gray-50 relative',
    content: isCompact ? 'px-4 py-4' : 'px-6 py-6',
    sectionSpacing: isCompact ? 'space-y-4' : 'space-y-6',
    stepSpacing: isCompact ? 'space-y-4' : 'space-y-6',
    stepTitle: isCompact ? 'text-lg font-semibold text-gray-900 mb-2' : 'text-xl font-semibold text-gray-900 mb-3',
    stepDesc: isCompact ? 'text-xs text-gray-600 mb-4' : 'text-sm text-gray-600 mb-6',
    label: isCompact ? 'text-xs font-medium text-gray-700 mb-1' : 'text-sm font-medium text-gray-700 mb-2',
    input: isCompact 
      ? 'min-h-[40px] px-3 py-2 text-sm' 
      : 'min-h-[44px] px-4 py-2 text-base',
    footer: isCompact ? 'px-4 py-3' : 'px-6 py-4',
    button: isCompact ? 'h-8 text-xs px-4 py-1' : 'h-10 text-sm px-6 py-2',
    backButton: isCompact ? 'h-8 text-xs px-3 py-1' : 'h-10 text-sm px-4 py-2'
  };

  const totalSpend = campaignDraft.isContinuous ? 'Ongoing' : `$${(campaignDraft.dailyBudget * campaignDraft.durationDays).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500"
        onClick={onClose}
      />
      
      {/* Drawer with variant-based styling */}
      <div className={`absolute right-0 top-0 h-full w-full ${styles.drawer} bg-white shadow-2xl transform transition-transform duration-500 translate-x-0 border-l border-gray-200 flex flex-col`}>
        {/* Header - responsive to variant */}
        <div className={`relative ${styles.header.container} flex items-center flex-shrink-0`}>
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className={styles.header.title}>{editingCampaignId ? 'Edit Campaign' : 'Create Boost Campaign'}</h1>
              <p className={styles.header.subtitle}>Step {currentStep} of {steps.length}</p>
            </div>
            <button
              onClick={onClose}
              className={`${styles.header.closeBtn} transition-colors duration-200 flex items-center justify-center relative z-10`}
              aria-label="Close modal"
            >
              <X className={styles.header.closeIcon} />
            </button>
          </div>
          
          {!isCompact && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 pointer-events-none" />
            </>
          )}
        </div>

        {/* Stepper - responsive with relative positioning */}
        <div className={`${styles.stepper} border-b border-gray-200 flex-shrink-0`}>
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Content area - responsive */}
        <div className={`flex-1 overflow-y-auto ${styles.content}`}>
          <div className={styles.sectionSpacing}>
          
            {/* Step 1: Choose Boost Target */}
            {currentStep === 1 && (
              <div className={styles.stepSpacing}>
                <div>
                  <h2 className={styles.stepTitle}>What would you like to boost?</h2>
                  <p className={styles.stepDesc}>Select the type of content you want to promote to your target audience.</p>
                  
                  <div className={styles.stepSpacing}>
                    <div>
                      <label htmlFor="boost-target" className={styles.label}>
                        Boost Target
                      </label>
                      <select
                        id="boost-target"
                        value={campaignDraft.title}
                        onChange={(e) => dispatch(setTitle(e.target.value))}
                        className={`w-full ${styles.input} border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white`}
                      >
                        <option value="">Select boost target</option>
                        <option value="coupon-offer">🎟️ Coupon Offer</option>
                        <option value="business-profile">🏢 Business Profile</option>
                        <option value="special-event">🎉 Special Event</option>
                        <option value="new-product">🚀 New Product Launch</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Budget & Duration */}
            {currentStep === 2 && (
              <div className={styles.stepSpacing}>
                <div>
                  <h2 className={styles.stepTitle}>Set your budget and duration</h2>
                  <p className={styles.stepDesc}>Configure how much you want to spend and for how long your campaign should run.</p>
                  
                  <div className={styles.stepSpacing}>
                    <BudgetSlider
                      label="Daily Budget"
                      value={campaignDraft.dailyBudget}
                      min={5}
                      max={200}
                      step={5}
                      onChange={(value) => dispatch(setBudgetAndDuration({ dailyBudget: value, durationDays: campaignDraft.durationDays, isContinuous: campaignDraft.isContinuous }))}
                      prefix="$"
                    />

                    <BudgetSlider
                      label="Campaign Duration"
                      value={campaignDraft.durationDays}
                      min={1}
                      max={30}
                      step={1}
                      onChange={(value) => dispatch(setBudgetAndDuration({ dailyBudget: campaignDraft.dailyBudget, durationDays: value, isContinuous: campaignDraft.isContinuous }))}
                      suffix={campaignDraft.durationDays === 1 ? 'day' : 'days'}
                    />

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="continuous"
                        checked={campaignDraft.isContinuous}
                        onChange={(e) => dispatch(setBudgetAndDuration({ dailyBudget: campaignDraft.dailyBudget, durationDays: campaignDraft.durationDays, isContinuous: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="continuous" className="text-sm font-medium text-gray-700">
                        Run continuously until paused
                      </label>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900">Total Campaign Spend:</span>
                        <span className="text-lg font-bold text-blue-600">{totalSpend}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Estimated Results */}
            {currentStep === 3 && (
              <div className={styles.stepSpacing}>
                <div>
                  <h2 className={styles.stepTitle}>Estimated campaign results</h2>
                  <p className={styles.stepDesc}>Based on your budget and targeting, here what you can expect from your campaign.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <ResultMetricCard
                      title="Estimated Impressions"
                      value="8,500"
                      percentage="+45%"
                      percentageColor="text-emerald-600"
                      icon="👁️"
                      description="People who will see your boosted content"
                    />
                    <ResultMetricCard
                      title="Estimated Profile Views"
                      value="1,200"
                      percentage="+180%"
                      percentageColor="text-blue-600"
                      icon="👤"
                      description="Additional visits to your business profile"
                    />
                    <ResultMetricCard
                      title="Estimated Redemptions"
                      value="85"
                      percentage="+220%"
                      percentageColor="text-emerald-600"
                      icon="🎯"
                      description="Expected conversions from your campaign"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Note:</strong> Estimates are based on similar campaigns in your area and industry. Actual results may vary based on market conditions and campaign performance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Audience Targeting */}
            {currentStep === 4 && (
              <div className={styles.stepSpacing}>
                <div>
                  <h2 className={styles.stepTitle}>Target your audience</h2>
                  <p className={styles.stepDesc}>Define who should see your boosted content and where they located.</p>
                  
                  <div className={styles.stepSpacing}>
                    <BudgetSlider
                      label="Target Radius"
                      value={campaignDraft.radiusKm}
                      min={1}
                      max={25}
                      step={1}
                      onChange={(value) => dispatch(setAudience({ audienceType: campaignDraft.audienceType, radiusKm: value }))}
                      suffix={campaignDraft.radiusKm === 1 ? 'mile' : 'miles'}
                    />

                    <div className="space-y-2">
                      <label htmlFor="audience-select" className={styles.label}>
                        Target Audience
                      </label>
                      <select
                        id="audience-select"
                        value={campaignDraft.audienceType}
                        onChange={(e) => dispatch(setAudience({ 
                          audienceType: e.target.value as "local" | "targeted" | "broad", 
                          radiusKm: campaignDraft.radiusKm 
                        }))}
                        className={`w-full ${styles.input} border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white`}
                      >
                        <option value="local">🌟 All Customers</option>
                        <option value="targeted">🆕 New Customers</option>
                        <option value="broad">🔄 Returning Customers</option>
                      </select>
                    </div>

                    <AudiencePreview radius={campaignDraft.radiusKm} audience={campaignDraft.audienceType} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA - responsive */}
        <div className={`border-t border-gray-200 ${styles.footer} bg-white flex-shrink-0`}>
          <div className="flex justify-between items-center">
            {/* Back button */}
            {currentStep > 1 ? (
              <button
                onClick={handlePrevStep}
                className={`flex items-center ${styles.backButton} text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            ) : (
              <div />
            )}

            {/* Continue/Launch button */}
            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={!canContinue}
                className={`${styles.button} rounded-xl transition-all duration-200 font-semibold ${
                  canContinue
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleLaunch}
                className={`${styles.button} rounded-xl transition-all duration-200 font-semibold ${
                  editingCampaignId 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg hover:from-emerald-700 hover:to-green-700 transform hover:scale-105'
                }`}
              >
                {editingCampaignId ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Campaign
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🚀 Launch Boost Campaign
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}