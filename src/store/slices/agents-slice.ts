import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { agentsApi } from '@/api/agents-api';
import { Agent } from '@/types/agent';

interface AgentsState {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AgentsState = {
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,
};

export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await agentsApi.getAgents();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch agents');
    }
  }
);

export const fetchAgentById = createAsyncThunk(
  'agents/fetchAgentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await agentsApi.getAgentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch agent');
    }
  }
);

export const createAgent = createAsyncThunk(
  'agents/createAgent',
  async (agent: Omit<Agent, 'id'>, { rejectWithValue }) => {
    try {
      const response = await agentsApi.createAgent(agent);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create agent');
    }
  }
);

export const updateAgent = createAsyncThunk(
  'agents/updateAgent',
  async ({ id, data }: { id: string; data: Partial<Agent> }, { rejectWithValue }) => {
    try {
      const response = await agentsApi.updateAgent(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update agent');
    }
  }
);

export const deleteAgent = createAsyncThunk(
  'agents/deleteAgent',
  async (id: string, { rejectWithValue }) => {
    try {
      await agentsApi.deleteAgent(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete agent');
    }
  }
);

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    selectAgent: (state, action: PayloadAction<Agent | null>) => {
      state.selectedAgent = action.payload;
    },
    clearAgentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Agents
      .addCase(fetchAgents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Agent by ID
      .addCase(fetchAgentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAgent = action.payload;
        // Update the agent in the agents array if it exists
        const index = state.agents.findIndex((agent) => agent.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        } else {
          state.agents.push(action.payload);
        }
      })
      .addCase(fetchAgentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Agent
      .addCase(createAgent.fulfilled, (state, action) => {
        state.agents.push(action.payload);
      })
      // Update Agent
      .addCase(updateAgent.fulfilled, (state, action) => {
        const index = state.agents.findIndex((agent) => agent.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        }
        if (state.selectedAgent?.id === action.payload.id) {
          state.selectedAgent = action.payload;
        }
      })
      // Delete Agent
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter((agent) => agent.id !== action.payload);
        if (state.selectedAgent?.id === action.payload) {
          state.selectedAgent = null;
        }
      });
  },
});

export const { selectAgent, clearAgentsError } = agentsSlice.actions;
export const agentsReducer = agentsSlice.reducer;