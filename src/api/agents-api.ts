import axiosInstance from './axios-instance';
import { Agent } from '@/types/agent';

// Types for agent statuses and types
export type AgentStatus = 'active' | 'training' | 'offline' | 'draft';
export type AgentType = 'support' | 'sales' | 'leads' | 'other';

// Extended agent interface with additional properties
export interface AgentWithStats extends Agent {
  status?: AgentStatus;
  type?: AgentType;
  stats?: {
    conversations: number;
    satisfaction: string;
    responseTime: string;
    lastActive: Date;
    usage: number;
  };
}

export const agentsApi = {
  getAgents: () => {
    // return axiosInstance.get('/agents');
    // Mock data for agents
    const mockAgents: AgentWithStats[] = [
      {
        id: '1',
        name: 'Customer Support Agent',
        description: 'An AI assistant for customer support.',
        model: 'GPT-4',
        systemPrompt: 'How can I help you today?',
        temperature: 0.7,
        maxTokens: 1000,
        userId: 'user1',
        createdAt: '2025-03-01T00:00:00Z',
        updatedAt: '2025-03-01T00:00:00Z',
        status: 'active',
        type: 'support',
        stats: {
          conversations: 128,
          satisfaction: '92%',
          responseTime: '1.2s',
          lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          usage: 78
        }
      },
      {
        id: '2',
        name: 'Sales Assistant',
        description: 'An AI assistant for sales and lead generation.',
        model: 'GPT-3.5',
        systemPrompt: 'I can help you with product information and pricing.',
        temperature: 0.5,
        maxTokens: 800,
        userId: 'user1',
        createdAt: '2025-02-20T00:00:00Z',
        updatedAt: '2025-02-20T00:00:00Z',
        status: 'active',
        type: 'sales',
        stats: {
          conversations: 86,
          satisfaction: '88%',
          responseTime: '1.5s',
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          usage: 65
        }
      },
      {
        id: '3',
        name: 'Technical Support Agent',
        description: 'An AI assistant for technical support and troubleshooting.',
        model: 'GPT-4',
        systemPrompt: 'Let me assist you with technical issues.',
        temperature: 0.6,
        maxTokens: 1200,
        userId: 'user1',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
        status: 'training',
        type: 'support',
        stats: {
          conversations: 42,
          satisfaction: '85%',
          responseTime: '1.8s',
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          usage: 32
        }
      },
      {
        id: '4',
        name: 'Lead Generation Agent',
        description: 'An AI assistant focused on qualifying leads and collecting contact information.',
        model: 'GPT-4',
        systemPrompt: 'I\'m here to help you find the right solution for your needs.',
        temperature: 0.7,
        maxTokens: 1000,
        userId: 'user1',
        createdAt: '2025-02-10T00:00:00Z',
        updatedAt: '2025-02-10T00:00:00Z',
        status: 'offline',
        type: 'leads',
        stats: {
          conversations: 64,
          satisfaction: '90%',
          responseTime: '1.3s',
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          usage: 45
        }
      },
      {
        id: '5',
        name: 'Onboarding Assistant',
        description: 'An AI assistant that helps new users get started with the platform.',
        model: 'GPT-3.5',
        systemPrompt: 'I\'ll guide you through setting up your account and getting started.',
        temperature: 0.6,
        maxTokens: 900,
        userId: 'user1',
        createdAt: '2025-03-05T00:00:00Z',
        updatedAt: '2025-03-05T00:00:00Z',
        status: 'draft',
        type: 'other',
        stats: {
          conversations: 0,
          satisfaction: 'N/A',
          responseTime: 'N/A',
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
          usage: 0
        }
      }
    ];
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockAgents }), 1000); // Simulating a delay
    });
  },

  getAgentById: (id: string) => {
    // return axiosInstance.get(`/agents/${id}`);
    // Mock data for a single agent by id
    const mockAgent: AgentWithStats = {
      id,
      name: `Agent ${id}`,
      description: `An AI assistant designed to help with specific tasks.`,
      model: 'GPT-4',
      systemPrompt: 'How can I assist you today?',
      temperature: 0.7,
      maxTokens: 1000,
      userId: 'user1',
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2025-03-01T00:00:00Z',
      status: 'active',
      type: 'support',
      stats: {
        conversations: 128,
        satisfaction: '92%',
        responseTime: '1.2s',
        lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        usage: 78
      }
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockAgent }), 1000); // Simulating a delay
    });
  },

  createAgent: (agent: Omit<Agent, 'id'>) => {
    // return axiosInstance.post('/agents', agent);
     // Simulate the creation of a new agent
    const newAgent: Agent = {
      id: (Math.random() * 1000).toString(),
      ...agent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: newAgent }), 1000); // Simulating a delay
    });
  },

  updateAgent: (id: string, data: Partial<Agent>) => {
    // return axiosInstance.put(`/agents/${id}`, data);
       // Simulate updating an agent
    const updatedAgent: Agent = {
      id,
      name: data.name || `Agent ${id}`,
      description: data.description || `An updated AI assistant for id ${id}.`,
      model: data.model || 'GPT-4',
      systemPrompt: data.systemPrompt || 'How can I help you?',
      temperature: data.temperature || 0.7,
      maxTokens: data.maxTokens || 1000,
      userId: 'user1',
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: updatedAgent }), 1000); // Simulating a delay
    });
  },

  deleteAgent: (id: string) => {
    // return axiosInstance.delete(`/agents/${id}`);
     // Simulate deleting an agent
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { message: 'Agent deleted successfully' } }), 1000); // Simulating a delay
    });
  },

  getAgentTypes: () => {
    // Return available agent types
    const agentTypes = [
      { id: 'support', name: 'Customer Support' },
      { id: 'sales', name: 'Sales' },
      { id: 'leads', name: 'Lead Generation' },
      { id: 'other', name: 'Other' }
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: agentTypes }), 300);
    });
  },

  getAgentStatuses: () => {
    // Return available agent statuses
    const agentStatuses = [
      { id: 'active', name: 'Active' },
      { id: 'training', name: 'Training' },
      { id: 'offline', name: 'Offline' },
      { id: 'draft', name: 'Draft' }
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: agentStatuses }), 300);
    });
  }
};