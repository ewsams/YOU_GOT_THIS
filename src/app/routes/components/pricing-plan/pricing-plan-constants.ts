// src/app/pricing-plan/pricing-plan-constants.ts

import { PricingPlan } from 'src/app/common/models/pricing-plan.model';

export const PRICING_PLANS: Array<PricingPlan> = [
  {
    title: 'BASIC',
    monthlyCost: 'Free',
    annualCost: 'Free',
    items: [
      'Upload up to 5 PDFs per month',
      'Basic vectorization',
      'Interactive  GUI',
    ],
    buttonText: 'Get Started',
    footer: 'Ideal for individuals and small projects.',
  },
  {
    title: 'PRO',
    monthlyCost: '$38',
    annualCost: '$400',
    items: [
      'Upload up to 50 MB per month',
      'Advanced vectorization',
      'Interactive  GUI',
      'Priority customer support',
    ],
    buttonText: 'Our Most Popular',
    footer: 'Perfect for professionals and businesses.',
  },
  {
    title: 'BUSINESS',
    monthlyCost: '$56',
    annualCost: '$500',
    items: [
      'Upload up to 200 MB per month',
      'Premium vectorization',
      'Interactive GUI',
      'Dedicated account manager',
    ],
    buttonText: 'Get Started',
    footer: 'Tailored for medium to large-sized businesses.',
  },
  {
    title: 'ENTERPRISE',
    monthlyCost: 'Starting at $72',
    annualCost: 'Starting at $800',
    items: [
      '400 MB uploads',
      'Premium vectorization',
      'Interactive GUI',
      'Dedicated account manager',
      'Custom integrations',
      'Onboarding & training',
      '24/7 priority support',
    ],
    buttonText: 'Get Started',
    footer: 'For organizations with unique requirements.',
  },
];
