import { format } from 'date-fns';

// Types for conversations and leads
export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'human-agent' | 'system';
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany: string;
  status: 'active' | 'closed' | 'pending' | 'handedOff';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
  tags: string[];
  isStarred: boolean;
  isHandedOff: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'new' | 'qualified' | 'converted';
  createdAt: Date;
  lastContact: Date;
  notes: string;
  tags: string[];
}

export const conversationsApi = {
  getConversations: () => {
    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: '1',
        agentId: '1',
        agentName: 'Customer Support Agent',
        agentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        customerPhone: '+1 (555) 123-4567',
        customerCompany: 'Acme Inc.',
        status: 'active',
        lastMessage: 'I need help with my recent order #12345',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        unreadCount: 2,
        messages: [
          {
            id: '101',
            sender: 'customer',
            content: 'Hello, I need help with my recent order #12345',
            timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
            read: true
          },
          {
            id: '102',
            sender: 'agent',
            content: 'Hi John, I\'d be happy to help you with your order. Could you please provide more details about the issue you\'re experiencing?',
            timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
            read: true
          },
          {
            id: '103',
            sender: 'customer',
            content: 'I ordered a laptop last week, but I received a tablet instead.',
            timestamp: new Date(Date.now() - 1000 * 60 * 7), // 7 minutes ago
            read: true
          },
          {
            id: '104',
            sender: 'agent',
            content: 'I apologize for the mix-up. Let me check your order details.',
            timestamp: new Date(Date.now() - 1000 * 60 * 6), // 6 minutes ago
            read: true
          },
          {
            id: '105',
            sender: 'customer',
            content: 'Thank you. The order number is #12345.',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            read: false
          }
        ],
        tags: ['order-issue', 'high-priority'],
        isStarred: true,
        isHandedOff: false
      },
      {
        id: '2',
        agentId: '2',
        agentName: 'Sales Assistant',
        agentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bella',
        customerName: 'Emily Johnson',
        customerEmail: 'emily.johnson@example.com',
        customerPhone: '+1 (555) 987-6543',
        customerCompany: 'Johnson & Co',
        status: 'closed',
        lastMessage: 'Thank you for your help!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        unreadCount: 0,
        messages: [
          {
            id: '201',
            sender: 'customer',
            content: 'Hi, I\'m interested in your premium subscription plan.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            read: true
          },
          {
            id: '202',
            sender: 'agent',
            content: 'Hello Emily! I\'d be happy to tell you about our premium plans. What specific features are you looking for?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.9), // 3.9 hours ago
            read: true
          },
          {
            id: '203',
            sender: 'customer',
            content: 'I need something that supports at least 10 team members and includes analytics.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.8), // 3.8 hours ago
            read: true
          },
          {
            id: '204',
            sender: 'agent',
            content: 'Our Business plan sounds perfect for your needs. It supports up to 20 team members and includes advanced analytics. It\'s $49.99/month.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
            read: true
          },
          {
            id: '205',
            sender: 'customer',
            content: 'That sounds great! How do I sign up?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.2), // 3.2 hours ago
            read: true
          },
          {
            id: '206',
            sender: 'agent',
            content: 'I\'ll send you a direct link to sign up. You can use the code WELCOME20 for a 20% discount on your first month!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.1), // 3.1 hours ago
            read: true
          },
          {
            id: '207',
            sender: 'customer',
            content: 'Thank you for your help!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            read: true
          }
        ],
        tags: ['sales-lead', 'converted'],
        isStarred: false,
        isHandedOff: false
      },
      {
        id: '3',
        agentId: '3',
        agentName: 'Technical Support Agent',
        agentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zoe',
        customerName: 'Michael Brown',
        customerEmail: 'michael.brown@example.com',
        customerPhone: '+1 (555) 456-7890',
        customerCompany: 'Tech Solutions Ltd',
        status: 'handedOff',
        lastMessage: 'I\'m still experiencing the same issue after trying those steps.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 1,
        messages: [
          {
            id: '301',
            sender: 'customer',
            content: 'I\'m having trouble connecting to the API. I keep getting a 403 error.',
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
            read: true
          },
          {
            id: '302',
            sender: 'agent',
            content: 'Hello Michael, I\'m sorry to hear you\'re having trouble. Let\'s troubleshoot this together. Have you checked if your API key is valid?',
            timestamp: new Date(Date.now() - 1000 * 60 * 43), // 43 minutes ago
            read: true
          },
          {
            id: '303',
            sender: 'customer',
            content: 'Yes, I\'ve verified the API key is correct. I can use it in Postman without issues.',
            timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
            read: true
          },
          {
            id: '304',
            sender: 'agent',
            content: 'Could you try clearing your browser cache and cookies? Also, check if you\'re including the correct headers in your request.',
            timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
            read: true
          },
          {
            id: '305',
            sender: 'customer',
            content: 'I\'m still experiencing the same issue after trying those steps.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false
          },
          {
            id: '306',
            sender: 'system',
            content: 'This conversation has been handed off to a human agent.',
            timestamp: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
            read: true
          },
          {
            id: '307',
            sender: 'human-agent',
            content: 'Hi Michael, this is Sarah from our technical support team. I\'ll be taking over from our AI assistant to help resolve your API connection issue. Could you share your API endpoint and the exact error message you\'re seeing?',
            timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
            read: true
          }
        ],
        tags: ['technical-issue', 'api-problem', 'escalated'],
        isStarred: true,
        isHandedOff: true
      },
      {
        id: '4',
        agentId: '1',
        agentName: 'Customer Support Agent',
        agentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah.wilson@example.com',
        customerPhone: '+1 (555) 789-0123',
        customerCompany: 'Wilson Designs',
        status: 'active',
        lastMessage: 'When can I expect a response from your team?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        unreadCount: 1,
        messages: [
          {
            id: '401',
            sender: 'customer',
            content: 'I submitted a design request last week but haven\'t heard back.',
            timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
            read: true
          },
          {
            id: '402',
            sender: 'agent',
            content: 'Hello Sarah, I apologize for the delay. Let me check the status of your design request.',
            timestamp: new Date(Date.now() - 1000 * 60 * 18), // 18 minutes ago
            read: true
          },
          {
            id: '403',
            sender: 'customer',
            content: 'Thank you. The request number is #DR-789.',
            timestamp: new Date(Date.now() - 1000 * 60 * 17), // 17 minutes ago
            read: true
          },
          {
            id: '404',
            sender: 'agent',
            content: 'I see your request in our system. It\'s currently in the review stage. Our design team typically takes 7-10 business days to complete requests.',
            timestamp: new Date(Date.now() - 1000 * 60 * 16), // 16 minutes ago
            read: true
          },
          {
            id: '405',
            sender: 'customer',
            content: 'When can I expect a response from your team?',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            read: false
          }
        ],
        tags: ['design-request', 'follow-up'],
        isStarred: false,
        isHandedOff: false
      },
      {
        id: '5',
        agentId: '2',
        agentName: 'Sales Assistant',
        agentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bella',
        customerName: 'David Lee',
        customerEmail: 'david.lee@example.com',
        customerPhone: '+1 (555) 234-5678',
        customerCompany: 'Lee Enterprises',
        status: 'pending',
        lastMessage: 'I\'ll think about it and get back to you.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 0,
        messages: [
          {
            id: '501',
            sender: 'customer',
            content: 'What are the pricing options for your enterprise plan?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
            read: true
          },
          {
            id: '502',
            sender: 'agent',
            content: 'Hello David! Our enterprise plan starts at $499/month and includes unlimited users, priority support, and custom integrations. Would you like me to send you a detailed brochure?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.8), // 24.8 hours ago
            read: true
          },
          {
            id: '503',
            sender: 'customer',
            content: 'Yes, please send me the brochure. Also, do you offer any discounts for annual subscriptions?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), // 24.5 hours ago
            read: true
          },
          {
            id: '504',
            sender: 'agent',
            content: 'Absolutely! We offer a 15% discount for annual subscriptions. I\'ll include that information in the brochure. Is there a specific email you\'d like me to send it to?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.2), // 24.2 hours ago
            read: true
          },
          {
            id: '505',
            sender: 'customer',
            content: 'Please send it to david.lee@example.com. What\'s the typical onboarding process like?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.1), // 24.1 hours ago
            read: true
          },
          {
            id: '506',
            sender: 'agent',
            content: 'Our onboarding process typically takes 2-3 weeks. We assign a dedicated account manager who will guide you through setup, training, and integration. Would you like to schedule a demo with one of our account managers?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.05), // 24.05 hours ago
            read: true
          },
          {
            id: '507',
            sender: 'customer',
            content: 'I\'ll think about it and get back to you.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
            read: true
          }
        ],
        tags: ['enterprise', 'pricing-inquiry', 'follow-up'],
        isStarred: false,
        isHandedOff: false
      }
    ];

    // Simulate API call with delay
    return new Promise<{ data: Conversation[] }>((resolve) => {
      setTimeout(() => resolve({ data: mockConversations }), 500);
    });
  },

  getConversationById: (id: string) => {
    // Find the conversation by ID
    const mockConversations = [
      {
        id: '1',
        agentId: '1',
        agentName: 'Customer Support Agent',
        agentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        customerPhone: '+1 (555) 123-4567',
        customerCompany: 'Acme Inc.',
        status: 'active',
        lastMessage: 'I need help with my recent order #12345',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        unreadCount: 2,
        messages: [
          {
            id: '101',
            sender: 'customer',
            content: 'Hello, I need help with my recent order #12345',
            timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
            read: true
          },
          {
            id: '102',
            sender: 'agent',
            content: 'Hi John, I\'d be happy to help you with your order. Could you please provide more details about the issue you\'re experiencing?',
            timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
            read: true
          },
          {
            id: '103',
            sender: 'customer',
            content: 'I ordered a laptop last week, but I received a tablet instead.',
            timestamp: new Date(Date.now() - 1000 * 60 * 7), // 7 minutes ago
            read: true
          },
          {
            id: '104',
            sender: 'agent',
            content: 'I apologize for the mix-up. Let me check your order details.',
            timestamp: new Date(Date.now() - 1000 * 60 * 6), // 6 minutes ago
            read: true
          },
          {
            id: '105',
            sender: 'customer',
            content: 'Thank you. The order number is #12345.',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            read: false
          }
        ],
        tags: ['order-issue', 'high-priority'],
        isStarred: true,
        isHandedOff: false
      }
    ];
    
    const conversation = mockConversations.find(c => c.id === id) || {
      id,
      agentId: '1',
      agentName: 'AI Assistant',
      agentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Default',
      customerName: 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+1 (555) 000-0000',
      customerCompany: 'Company',
      status: 'active',
      lastMessage: 'No messages yet',
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [],
      tags: [],
      isStarred: false,
      isHandedOff: false
    };
    
    return new Promise<{ data: Conversation }>((resolve) => {
      setTimeout(() => resolve({ data: conversation }), 500);
    });
  },

  getLeads: (filters?: { status?: string; search?: string }) => {
    // Mock leads data
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Inc.',
        source: 'Customer Support Agent',
        status: 'new',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        lastContact: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        notes: 'Lead generated from conversation with Customer Support Agent',
        tags: ['order-issue', 'high-priority']
      },
      {
        id: '2',
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        phone: '+1 (555) 987-6543',
        company: 'Johnson & Co',
        source: 'Sales Assistant',
        status: 'converted',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        lastContact: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        notes: 'Lead generated from conversation with Sales Assistant',
        tags: ['sales-lead', 'converted']
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 456-7890',
        company: 'Tech Solutions Ltd',
        source: 'Technical Support Agent',
        status: 'qualified',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        lastContact: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        notes: 'Lead generated from conversation with Technical Support Agent',
        tags: ['technical-issue', 'api-problem', 'escalated']
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        phone: '+1 (555) 789-0123',
        company: 'Wilson Designs',
        source: 'Customer Support Agent',
        status: 'new',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        lastContact: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        notes: 'Lead generated from conversation with Customer Support Agent',
        tags: ['design-request', 'follow-up']
      },
      {
        id: '5',
        name: 'David Lee',
        email: 'david.lee@example.com',
        phone: '+1 (555) 234-5678',
        company: 'Lee Enterprises',
        source: 'Sales Assistant',
        status: 'new',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        notes: 'Lead generated from conversation with Sales Assistant',
        tags: ['enterprise', 'pricing-inquiry', 'follow-up']
      }
    ];

    // Apply filters if provided
    let filteredLeads = [...mockLeads];
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLeads = filteredLeads.filter(lead => 
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
        );
      }
    }

    // Simulate API call with delay
    return new Promise<{ data: Lead[] }>((resolve) => {
      setTimeout(() => resolve({ data: filteredLeads }), 500);
    });
  },

  sendMessage: (conversationId: string, message: string, sender: 'human-agent' | 'agent') => {
    // Simulate sending a message
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      sender,
      timestamp: new Date(),
      read: true
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: newMessage 
        } 
      }), 500);
    });
  },

  updateConversationStatus: (conversationId: string, status: 'active' | 'closed' | 'pending' | 'handedOff') => {
    // Simulate updating conversation status
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Conversation status updated successfully',
          conversation: {
            id: conversationId,
            status
          }
        } 
      }), 500);
    });
  },

  updateLeadStatus: (leadId: string, status: 'new' | 'qualified' | 'converted') => {
    // Simulate updating lead status
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Lead status updated successfully',
          lead: {
            id: leadId,
            status
          }
        } 
      }), 500);
    });
  },

  toggleHandoff: (conversationId: string, handedOff: boolean) => {
    // Simulate toggling handoff status
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: handedOff ? 'Conversation handed off to human agent' : 'Conversation returned to AI agent',
          conversation: {
            id: conversationId,
            isHandedOff: handedOff,
            status: handedOff ? 'handedOff' : 'active'
          }
        } 
      }), 500);
    });
  }
};