import { format, subDays } from 'date-fns';

// Types for analytics data
export interface PerformanceMetric {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon?: React.ReactNode;
}

export interface QualityMetrics {
  upvotes: number;
  downvotes: number;
  ratio: number;
  categories: {
    name: string;
    upvotes: number;
    downvotes: number;
    ratio: number;
  }[];
}

export interface FlaggedPhrase {
  phrase: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
}

export interface WeakResponse {
  query: string;
  response: string;
  frequency: number;
  suggestion: string;
}

export interface AIQualityRatings {
  overall: number;
  accuracy: number;
  tone: number;
  helpfulness: number;
  benchmark: number;
}

export interface KnowledgeGap {
  query: string;
  frequency: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ActionableInsight {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  suggestion: string;
}

export interface AnalyticsData {
  performanceMetrics: PerformanceMetric[];
  qualityMetrics: QualityMetrics;
  flaggedPhrases: FlaggedPhrase[];
  weakResponses: WeakResponse[];
  aiQualityRatings: AIQualityRatings;
  knowledgeGaps: KnowledgeGap[];
  actionableInsights: ActionableInsight[];
}

export const analyticsApi = {
  getAnalyticsData: (dateRange?: string, agentId?: string) => {
    // Mock data for analytics dashboard
    const mockData: AnalyticsData = {
      performanceMetrics: [
        { 
          title: 'Total Conversations', 
          value: 1248, 
          change: 12, 
          trend: 'up'
        },
        { 
          title: 'Resolution Rate', 
          value: '87%', 
          change: 5, 
          trend: 'up'
        },
        { 
          title: 'Avg. Response Time', 
          value: '1.2s', 
          change: -8, 
          trend: 'down'
        },
        { 
          title: 'User Satisfaction', 
          value: '92%', 
          change: 3, 
          trend: 'up'
        },
      ],
      
      qualityMetrics: {
        upvotes: 856,
        downvotes: 74,
        ratio: 92,
        categories: [
          { name: 'Product Info', upvotes: 312, downvotes: 18, ratio: 95 },
          { name: 'Technical Support', upvotes: 245, downvotes: 32, ratio: 88 },
          { name: 'Pricing', upvotes: 178, downvotes: 12, ratio: 94 },
          { name: 'Shipping', upvotes: 121, downvotes: 12, ratio: 91 },
        ]
      },
      
      flaggedPhrases: [
        { phrase: 'I don\'t know', count: 28, severity: 'high' },
        { phrase: 'I can\'t help with that', count: 19, severity: 'high' },
        { phrase: 'That\'s not possible', count: 15, severity: 'medium' },
        { phrase: 'You need to contact support', count: 12, severity: 'medium' },
        { phrase: 'I don\'t have that information', count: 10, severity: 'low' },
      ],
      
      weakResponses: [
        { 
          query: 'How do I reset my password?', 
          response: 'You should see a reset password link on the login page.',
          frequency: 8,
          suggestion: 'Provide step-by-step instructions with a direct link to the password reset page.'
        },
        { 
          query: 'When will my order arrive?', 
          response: 'Shipping usually takes 3-5 business days.',
          frequency: 6,
          suggestion: 'Offer to check the specific order status and provide tracking information.'
        },
        { 
          query: 'Do you offer refunds?', 
          response: 'Yes, we have a refund policy.',
          frequency: 5,
          suggestion: 'Explain the refund policy details and link to the full policy page.'
        },
      ],
      
      aiQualityRatings: {
        overall: 87,
        accuracy: 92,
        tone: 89,
        helpfulness: 85,
        benchmark: 82
      },
      
      knowledgeGaps: [
        { query: 'How do I integrate with Shopify?', frequency: 24, trend: 'up' },
        { query: 'What payment methods do you accept in Europe?', frequency: 18, trend: 'up' },
        { query: 'Can I use your API with Python?', frequency: 15, trend: 'stable' },
        { query: 'Do you offer volume discounts?', frequency: 12, trend: 'down' },
      ],
      
      actionableInsights: [
        { 
          title: 'Improve password reset responses',
          description: 'Current responses lack clear steps and direct links',
          impact: 'High',
          effort: 'Low',
          suggestion: 'Add step-by-step instructions with direct links'
        },
        { 
          title: 'Add Shopify integration documentation',
          description: 'Frequent questions about Shopify integration process',
          impact: 'High',
          effort: 'Medium',
          suggestion: 'Create dedicated Shopify integration guide'
        },
        { 
          title: 'Clarify European payment methods',
          description: 'Users confused about available payment options in Europe',
          impact: 'Medium',
          effort: 'Low',
          suggestion: 'Update FAQ and agent knowledge base with region-specific payment info'
        },
      ]
    };

    // Simulate API call with delay
    return new Promise<{ data: AnalyticsData }>((resolve) => {
      setTimeout(() => resolve({ data: mockData }), 500);
    });
  },

  getChartData: (dateRange: string, metric: string) => {
    // Mock chart data for different time periods
    const today = new Date();
    let data = [];
    
    if (dateRange === '7d') {
      // Generate daily data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        data.push({
          date: format(date, 'MMM dd'),
          value: Math.floor(Math.random() * 100) + 50,
        });
      }
    } else if (dateRange === '30d') {
      // Generate weekly data for the last 30 days
      for (let i = 4; i >= 0; i--) {
        const date = subDays(today, i * 7);
        data.push({
          date: format(date, 'MMM dd'),
          value: Math.floor(Math.random() * 200) + 100,
        });
      }
    } else if (dateRange === '90d') {
      // Generate monthly data for the last 90 days
      for (let i = 3; i >= 0; i--) {
        const date = subDays(today, i * 30);
        data.push({
          date: format(date, 'MMM yyyy'),
          value: Math.floor(Math.random() * 500) + 200,
        });
      }
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data }), 500);
    });
  }
};