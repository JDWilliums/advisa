"use client"

import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  AlertCircle, 
  Download, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Trash,
  CreditCardIcon,
  Info,
  ExternalLink
} from 'lucide-react';

// Types
interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface UsageMetric {
  name: string;
  used: number;
  limit: number;
  unit: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'annual';
  features: string[];
  cta: string;
  isPopular?: boolean;
  isEnterprise?: boolean;
}

// Data for demonstration
const invoices: Invoice[] = [
  { 
    id: 'INV-2025-001', 
    date: 'Mar 01, 2025', 
    amount: 99, 
    status: 'paid',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2025-002', 
    date: 'Feb 01, 2025', 
    amount: 99, 
    status: 'paid',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2025-003', 
    date: 'Jan 01, 2025', 
    amount: 99, 
    status: 'paid',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2025-004', 
    date: 'Dec 01, 2024', 
    amount: 99, 
    status: 'paid',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2025-005', 
    date: 'Nov 01, 2024', 
    amount: 99, 
    status: 'paid',
    downloadUrl: '#'
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'visa',
    last4: '4242',
    expiry: '04/26',
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'mastercard',
    last4: '5555',
    expiry: '08/25',
    isDefault: false
  }
];

const usageMetrics: UsageMetric[] = [
  {
    name: 'Reports',
    used: 37,
    limit: 50,
    unit: 'reports'
  },
  {
    name: 'Team Members',
    used: 5,
    limit: 10,
    unit: 'members'
  },
  {
    name: 'API Requests',
    used: 7500,
    limit: 10000,
    unit: 'requests'
  },
  {
    name: 'Storage',
    used: 2.8,
    limit: 5,
    unit: 'GB'
  }
];

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    interval: 'monthly',
    features: [
      '10 Reports per month',
      '3 Team members',
      '5,000 API requests',
      '2GB Storage',
      'Basic analytics'
    ],
    cta: 'Downgrade'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    interval: 'monthly',
    features: [
      '50 Reports per month',
      '10 Team members',
      '10,000 API requests',
      '5GB Storage',
      'Advanced analytics',
      'Priority support'
    ],
    cta: 'Current Plan',
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 249,
    interval: 'monthly',
    features: [
      'Unlimited Reports',
      'Unlimited Team members',
      'Unlimited API requests',
      '25GB Storage',
      'Advanced analytics',
      'Premium support',
      'Custom integrations',
      'Advanced security'
    ],
    cta: 'Upgrade',
    isEnterprise: true
  }
];

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Helper function to calculate percentage
const calculatePercentage = (used: number, limit: number): number => {
  return Math.min(Math.round((used / limit) * 100), 100);
};

// Helper function to get card icon and color based on type
const getCardDetails = (type: string): { color: string, icon: React.ReactNode } => {
  switch (type) {
    case 'visa':
      return { 
        color: 'text-blue-500 dark:text-blue-400', 
        icon: <CreditCard className="h-6 w-6" /> 
      };
    case 'mastercard':
      return { 
        color: 'text-red-500 dark:text-red-400', 
        icon: <CreditCard className="h-6 w-6" /> 
      };
    case 'amex':
      return { 
        color: 'text-green-500 dark:text-green-400', 
        icon: <CreditCard className="h-6 w-6" /> 
      };
    default:
      return { 
        color: 'text-gray-500 dark:text-gray-400', 
        icon: <CreditCard className="h-6 w-6" /> 
      };
  }
};

// Helper function to get status badge
const getStatusBadge = (status: string): { color: string, text: string } => {
  switch (status) {
    case 'paid':
      return { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', 
        text: 'Paid' 
      };
    case 'pending':
      return { 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', 
        text: 'Pending' 
      };
    case 'failed':
      return { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', 
        text: 'Failed' 
      };
    default:
      return { 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', 
        text: status 
      };
  }
};

// Billing Page Component
const BillingPage: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [showAddCard, setShowAddCard] = useState(false);
  const [expandPlans, setExpandPlans] = useState(false);
  
  const currentPlan = plans.find(plan => plan.isPopular);
  
  // Toggle between monthly and annual billing
  const toggleBillingInterval = () => {
    setBillingInterval(billingInterval === 'monthly' ? 'annual' : 'monthly');
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription, payment methods, and billing history</p>
      </div>
      
      {/* Current Plan Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-card border border-border rounded-lg p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
              <p className="text-muted-foreground">Your subscription renews on April 1, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Monthly</span>
              <button 
                onClick={toggleBillingInterval}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingInterval === 'annual' ? 'bg-blue-600' : 'bg-muted'
                }`}
              >
                <span
                  className={`${
                    billingInterval === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
              <span className="text-xs text-muted-foreground">Annual <span className="text-green-500">(Save 20%)</span></span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between border border-border rounded-md p-4 mb-4 bg-accent/30">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{currentPlan?.name} Plan</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {billingInterval === 'monthly' ? 'Monthly' : 'Annual'}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {billingInterval === 'monthly' 
                  ? `$${currentPlan?.price}/month` 
                  : `$${(currentPlan?.price || 0) * 9.6}/year (20% discount)`}
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
              <button 
                className="px-3 py-2 bg-accent text-foreground border border-border rounded-md hover:bg-accent/80 transition-colors text-sm"
                onClick={() => setExpandPlans(!expandPlans)}
              >
                Change Plan
              </button>
              <button className="px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-sm">
                {billingInterval === 'monthly' ? 'Switch to Annual' : 'Switch to Monthly'}
              </button>
            </div>
          </div>
          
          <h3 className="font-semibold text-foreground mb-3">Current Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usageMetrics.map((metric) => (
              <div key={metric.name} className="border border-border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">{metric.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {metric.used} / {metric.limit} {metric.unit}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      calculatePercentage(metric.used, metric.limit) > 90 
                        ? 'bg-red-500' 
                        : calculatePercentage(metric.used, metric.limit) > 75 
                          ? 'bg-yellow-500' 
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${calculatePercentage(metric.used, metric.limit)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const { color, icon } = getCardDetails(method.type);
              
              return (
                <div key={method.id} className="flex items-center justify-between border border-border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className={color}>
                      {icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
                      </div>
                      <div className="text-xs text-muted-foreground">Expires {method.expiry}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="text-xs bg-accent px-2 py-1 rounded-md text-foreground">
                        Default
                      </span>
                    )}
                    {!method.isDefault && (
                      <button className="text-blue-500 text-xs hover:text-blue-600 dark:hover:text-blue-400">
                        Set Default
                      </button>
                    )}
                    <button className="text-red-500 text-xs hover:text-red-600 dark:hover:text-red-400">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {!showAddCard ? (
            <button 
              className="mt-4 w-full px-3 py-2 border border-border rounded-md text-foreground hover:bg-accent/50 transition-colors flex items-center justify-center"
              onClick={() => setShowAddCard(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Payment Method
            </button>
          ) : (
            <div className="mt-4 border border-border rounded-md p-4">
              <h3 className="font-medium text-foreground mb-3">Add Payment Method</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Card Number</label>
                  <input type="text" className="w-full p-2 border border-input rounded-md bg-card text-foreground placeholder:text-muted-foreground" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Expiry Date</label>
                    <input type="text" className="w-full p-2 border border-input rounded-md bg-card text-foreground placeholder:text-muted-foreground" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">CVC</label>
                    <input type="text" className="w-full p-2 border border-input rounded-md bg-card text-foreground placeholder:text-muted-foreground" placeholder="123" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Name on Card</label>
                  <input type="text" className="w-full p-2 border border-input rounded-md bg-card text-foreground placeholder:text-muted-foreground" placeholder="John Doe" />
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button 
                    className="px-3 py-2 border border-border rounded-md text-foreground hover:bg-accent/50 transition-colors"
                    onClick={() => setShowAddCard(false)}
                  >
                    Cancel
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Add Card
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Plan comparison (visible when "Change Plan" is clicked) */}
      {expandPlans && (
        <div className="bg-card border border-border rounded-lg p-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Available Plans</h2>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setExpandPlans(false)}
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center border border-border rounded-md p-1 text-sm">
              <button 
                className={`px-3 py-1 rounded-md ${
                  billingInterval === 'monthly' 
                    ? 'bg-accent text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingInterval('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-3 py-1 rounded-md flex items-center ${
                  billingInterval === 'annual' 
                    ? 'bg-accent text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingInterval('annual')}
              >
                Annual <span className="ml-1 text-xs font-medium text-green-500">-20%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`border rounded-lg p-5 ${
                  plan.isPopular
                    ? 'border-blue-500 dark:border-blue-400 relative'
                    : 'border-border'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </div>
                )}
                <div className="text-center mb-4 pt-2">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-foreground">
                      ${billingInterval === 'annual' ? (plan.price * 0.8 * 12).toFixed(0) : plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingInterval === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingInterval === 'annual' && (
                    <div className="text-sm text-green-500 mt-1">
                      Save ${(plan.price * 0.2 * 12).toFixed(0)} per year
                    </div>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-2 rounded-md text-center ${
                    plan.isPopular
                      ? 'bg-accent text-foreground'
                      : plan.isEnterprise
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border border-border hover:bg-accent text-foreground'
                  }`}
                  disabled={plan.isPopular}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Need a custom plan? <a href="#" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">Contact sales</a>
            </p>
          </div>
        </div>
      )}
      
      {/* Billing History Section */}
      <div className="bg-card border border-border rounded-lg mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Billing History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/30">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => {
                const { color, text } = getStatusBadge(invoice.status);
                
                return (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{invoice.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                        {text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <a 
                        href={invoice.downloadUrl} 
                        className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center"
                        download
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-card border border-border rounded-lg p-5 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border border-border rounded-md">
            <button className="w-full flex justify-between items-center p-4 focus:outline-none text-left">
              <span className="font-medium text-foreground">How do I change my payment method?</span>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="p-4 border-t border-border text-muted-foreground">
              <p>You can add a new payment method in the Payment Methods section above. After adding a new method, you can set it as the default payment method for future billings.</p>
            </div>
          </div>
          
          <div className="border border-border rounded-md">
            <button className="w-full flex justify-between items-center p-4 focus:outline-none text-left">
              <span className="font-medium text-foreground">What happens if I exceed my plan limits?</span>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="p-4 border-t border-border text-muted-foreground">
              <p>If you reach your plan limits, you'll receive a notification. You can continue using the service, but some features might be limited. We recommend upgrading to a higher plan if you consistently reach your limits.</p>
            </div>
          </div>
          
          <div className="border border-border rounded-md">
            <button className="w-full flex justify-between items-center p-4 focus:outline-none text-left">
              <span className="font-medium text-foreground">Can I cancel my subscription anytime?</span>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="p-4 border-t border-border text-muted-foreground">
              <p>Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to the service until the end of your current billing period. No refunds are provided for partial months.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Need Help Section */}
      <div className="bg-card border border-border rounded-lg p-5 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Need help with billing?</h2>
          <p className="text-muted-foreground">Our support team is here to assist you with any questions.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;