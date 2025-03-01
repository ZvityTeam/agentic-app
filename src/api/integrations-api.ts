// Types for integrations data
export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string | string[];
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  featured?: boolean;
  stats?: {
    title: string;
    value: string;
    change?: number;
  }[];
}

export const integrationsApi = {
  getIntegrations: () => {
    // Mock integrations data
    const mockIntegrations: Integration[] = [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        description: 'Connect your WhatsApp Business account to engage with customers directly.',
        category: 'communication',
        status: 'connected',
        featured: true,
        stats: [
          { title: 'Active Conversations', value: '128', change: 12 },
          { title: 'Messages Sent', value: '1,432', change: 8 },
          { title: 'Response Rate', value: '94%', change: 3 },
        ]
      },
      {
        id: 'email',
        name: 'Email Integration',
        description: 'Send automated emails and notifications through your email provider.',
        category: 'communication',
        status: 'connected',
        featured: true,
        stats: [
          { title: 'Emails Sent', value: '856', change: 5 },
          { title: 'Open Rate', value: '42%', change: -2 },
          { title: 'Click Rate', value: '18%', change: 4 },
        ]
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Schedule appointments and meetings directly from conversations.',
        category: 'calendar',
        status: 'connected',
        featured: true,
        stats: [
          { title: 'Appointments', value: '42', change: 15 },
          { title: 'Booking Rate', value: '68%', change: 7 },
          { title: 'No-shows', value: '5%', change: -3 },
        ]
      },
      {
        id: 'stripe',
        name: 'Stripe Payments',
        description: 'Process payments and subscriptions securely within conversations.',
        category: 'payments',
        status: 'connected',
        featured: true,
        stats: [
          { title: 'Transactions', value: '86', change: 23 },
          { title: 'Revenue', value: '$4,280', change: 18 },
          { title: 'Avg. Order', value: '$49.76', change: -2 },
        ]
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Sync customer data and conversations with your Salesforce CRM.',
        category: 'crm',
        status: 'disconnected'
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Connect your HubSpot CRM to track leads and customer interactions.',
        category: 'crm',
        status: 'disconnected'
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Get notifications and manage conversations through Slack channels.',
        category: 'communication',
        status: 'disconnected'
      },
      {
        id: 'shopify',
        name: 'Shopify',
        description: 'Integrate with your Shopify store to handle orders and product inquiries.',
        category: 'payments',
        status: 'error'
      },
      {
        id: 'zendesk',
        name: 'Zendesk',
        description: 'Create and manage support tickets from AI conversations.',
        category: 'crm',
        status: 'disconnected'
      },
      {
        id: 'microsoft-calendar',
        name: 'Microsoft Calendar',
        description: 'Schedule meetings and appointments with Microsoft Calendar.',
        category: 'calendar',
        status: 'disconnected'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Process payments through PayPal directly in conversations.',
        category: 'payments',
        status: 'disconnected'
      },
      {
        id: 'telegram',
        name: 'Telegram',
        description: 'Connect your Telegram bot to engage with users on the platform.',
        category: 'communication',
        status: 'disconnected'
      },
    ];

    // Simulate API call with delay
    return new Promise<{ data: Integration[] }>((resolve) => {
      setTimeout(() => resolve({ data: mockIntegrations }), 500);
    });
  },

  getIntegrationById: (id: string) => {
    // Find the integration by ID
    const mockIntegrations = [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        description: 'Connect your WhatsApp Business account to engage with customers directly.',
        category: 'communication',
        status: 'connected',
        featured: true,
        stats: [
          { title: 'Active Conversations', value: '128', change: 12 },
          { title: 'Messages Sent', value: '1,432', change: 8 },
          { title: 'Response Rate', value: '94%', change: 3 },
        ]
      },
      // Add more integrations as needed
    ];
    
    const integration = mockIntegrations.find(i => i.id === id) || {
      id,
      name: `Integration ${id}`,
      description: 'Integration description',
      category: 'other',
      status: 'disconnected'
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: integration }), 500);
    });
  },

  connectIntegration: (id: string, credentials: any) => {
    // Simulate connecting to an integration
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Integration connected successfully',
          integration: {
            id,
            status: 'connected'
          }
        } 
      }), 1500);
    });
  },

  disconnectIntegration: (id: string) => {
    // Simulate disconnecting an integration
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Integration disconnected successfully',
          integration: {
            id,
            status: 'disconnected'
          }
        } 
      }), 800);
    });
  },

  updateIntegrationSettings: (id: string, settings: any) => {
    // Simulate updating integration settings
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Integration settings updated successfully' 
        } 
      }), 800);
    });
  }
};