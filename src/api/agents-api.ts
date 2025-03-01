import axiosInstance from './axios-instance';
import { Agent } from '@/types/agent';

export const agentsApi = {
  getAgents: () => {
    // return axiosInstance.get('/agents');
    // Mock data for agents
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Agent 1',
        description: 'An AI assistant for customer support.',
        model: 'GPT-4',
        systemPrompt: 'How can I help you today?',
        temperature: 0.7,
        maxTokens: 1000,
        userId: 'user1',
        createdAt: '2025-03-01T00:00:00Z',
        updatedAt: '2025-03-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Agent 2',
        description: 'An AI assistant for technical support.',
        model: 'GPT-3.5',
        systemPrompt: 'I can help you with tech-related queries.',
        temperature: 0.5,
        maxTokens: 800,
        userId: 'user1',
        createdAt: '2025-02-20T00:00:00Z',
        updatedAt: '2025-02-20T00:00:00Z',
      },
      {
        id: '3',
        name: 'Agent 3',
        description: 'An AI assistant for project management.',
        model: 'GPT-4',
        systemPrompt: 'Let me assist you with your projects.',
        temperature: 0.6,
        maxTokens: 1200,
        userId: 'user1',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
      },
    ];
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockAgents }), 1000); // Simulating a delay
    });
  },

  getAgentById: (id: string) => {
    // return axiosInstance.get(`/agents/${id}`);
    // Mock data for a single agent by id
    const mockAgent: Agent = {
      id,
      name: `Agent ${id}`,
      description: `An AI assistant for some purpose with id ${id}.`,
      model: 'GPT-4',
      systemPrompt: 'How can I assist you today?',
      temperature: 0.7,
      maxTokens: 1000,
      userId: 'user1',
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2025-03-01T00:00:00Z',
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
};