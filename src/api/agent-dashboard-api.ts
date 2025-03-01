import { format } from 'date-fns';

// Types for agent dashboard data
export interface PerformanceMetric {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon?: React.ReactNode;
}

export interface TopQuery {
  query: string;
  frequency: number;
}

export interface FlaggedPhrase {
  phrase: string;
  count: number;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  status: 'processed' | 'processing' | 'error';
  size: string;
  date: string;
}

export interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  enabled: boolean;
  icon?: React.ReactNode;
}

export interface AgentDashboardData {
  performanceMetrics: PerformanceMetric[];
  topQueries: TopQuery[];
  flaggedPhrases: FlaggedPhrase[];
  knowledgeDocuments: KnowledgeDocument[];
  integrations: Integration[];
}

export const agentDashboardApi = {
  getAgentDashboardData: (agentId: string) => {
    // Mock data for agent dashboard
    const mockData: AgentDashboardData = {
      performanceMetrics: [
        { 
          title: 'Queries Resolved', 
          value: 256, 
          change: 12, 
          trend: 'up'
        },
        { 
          title: 'Avg. Response Time', 
          value: '1.2s', 
          change: -8, 
          trend: 'down'
        },
        { 
          title: 'Satisfaction Rate', 
          value: '92%', 
          change: 5, 
          trend: 'up'
        },
        { 
          title: 'Flagged Responses', 
          value: 3, 
          change: -2, 
          trend: 'down'
        },
      ],
      
      topQueries: [
        { query: 'How do I reset my password?', frequency: 42 },
        { query: 'What are your business hours?', frequency: 38 },
        { query: 'Do you offer free shipping?', frequency: 27 },
        { query: 'How can I track my order?', frequency: 24 },
        { query: 'What is your return policy?', frequency: 19 },
      ],
      
      flaggedPhrases: [
        { phrase: 'I don\'t know', count: 5 },
        { phrase: 'I can\'t help with that', count: 3 },
        { phrase: 'That\'s not possible', count: 2 },
      ],
      
      knowledgeDocuments: [
        { id: 'doc1', name: 'Product Catalog.pdf', status: 'processed', size: '2.4 MB', date: '2025-03-15T10:30:00Z' },
        { id: 'doc2', name: 'FAQ.docx', status: 'processed', size: '1.1 MB', date: '2025-03-14T14:45:00Z' },
        { id: 'doc3', name: 'Return Policy.pdf', status: 'processing', size: '0.8 MB', date: '2025-03-16T09:15:00Z' },
        { id: 'doc4', name: 'Shipping Information.txt', status: 'error', size: '0.3 MB', date: '2025-03-16T11:20:00Z' },
        { id: 'doc5', name: 'Customer Support Guidelines.pdf', status: 'processed', size: '1.7 MB', date: '2025-03-13T16:30:00Z' },
      ],
      
      integrations: [
        { id: 'whatsapp', name: 'WhatsApp', status: 'connected', enabled: true },
        { id: 'email', name: 'Email', status: 'connected', enabled: true },
        { id: 'calendar', name: 'Calendar', status: 'disconnected', enabled: false },
        { id: 'payment', name: 'Payment Gateway', status: 'error', enabled: false },
      ]
    };

    // Simulate API call with delay
    return new Promise<{ data: AgentDashboardData }>((resolve) => {
      setTimeout(() => resolve({ data: mockData }), 500);
    });
  },

  getAgentConversationStats: (agentId: string, dateRange: string) => {
    // Mock conversation stats for different time periods
    const mockStats = {
      totalConversations: Math.floor(Math.random() * 500) + 100,
      averageResponseTime: (Math.random() * 2 + 0.5).toFixed(1) + 's',
      resolutionRate: Math.floor(Math.random() * 20 + 80) + '%',
      satisfactionScore: Math.floor(Math.random() * 15 + 85) + '%',
      chartData: Array(7).fill(0).map((_, i) => ({
        date: format(new Date(Date.now() - (6 - i) * 86400000), 'MMM dd'),
        conversations: Math.floor(Math.random() * 50) + 10,
        resolved: Math.floor(Math.random() * 40) + 10,
        escalated: Math.floor(Math.random() * 5) + 1,
      }))
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockStats }), 500);
    });
  },

  uploadDocument: (agentId: string, file: File) => {
    // Simulate document upload
    const mockResponse = {
      id: `doc-${Date.now()}`,
      name: file.name,
      status: 'processing',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      date: new Date().toISOString()
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockResponse }), 1500);
    });
  },

  updateAgentSettings: (agentId: string, settings: any) => {
    // Simulate updating agent settings
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { success: true, message: 'Settings updated successfully' } }), 800);
    });
  }
};