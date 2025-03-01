import { format } from 'date-fns';

// Types for dashboard data
export interface QuickStat {
  title: string;
  value: string | number;
  change: number;
  icon?: React.ReactNode;
}

export interface AnalyticData {
  day: {
    conversations: number;
    satisfaction: number;
    responseRate: number;
    responseTime: string;
    change: {
      conversations: number;
      satisfaction: number;
      responseRate: number;
      responseTime: number;
    }
  };
  week: {
    conversations: number;
    satisfaction: number;
    responseRate: number;
    responseTime: string;
    change: {
      conversations: number;
      satisfaction: number;
      responseRate: number;
      responseTime: number;
    }
  };
  month: {
    conversations: number;
    satisfaction: number;
    responseRate: number;
    responseTime: string;
    change: {
      conversations: number;
      satisfaction: number;
      responseRate: number;
      responseTime: number;
    }
  };
}

export interface DashboardData {
  quickStats: QuickStat[];
  analyticsData: AnalyticData;
}

export const dashboardApi = {
  getDashboardData: () => {
    // Mock data for dashboard
    const mockData: DashboardData = {
      quickStats: [
        { 
          title: 'Active Agents', 
          value: 3, 
          change: 12
        },
        { 
          title: 'Total Conversations', 
          value: 128, 
          change: -5
        },
        { 
          title: 'User Engagement', 
          value: '87%', 
          change: 23
        },
        { 
          title: 'Response Time', 
          value: '1.2s', 
          change: 15
        },
      ],
      
      analyticsData: {
        day: {
          conversations: 24,
          satisfaction: 92,
          responseRate: 98,
          responseTime: '1.2s',
          change: {
            conversations: 12,
            satisfaction: 5,
            responseRate: 2,
            responseTime: -0.3
          }
        },
        week: {
          conversations: 128,
          satisfaction: 87,
          responseRate: 95,
          responseTime: '1.5s',
          change: {
            conversations: 18,
            satisfaction: 3,
            responseRate: 1,
            responseTime: -0.2
          }
        },
        month: {
          conversations: 512,
          satisfaction: 85,
          responseRate: 93,
          responseTime: '1.8s',
          change: {
            conversations: 32,
            satisfaction: 7,
            responseRate: 4,
            responseTime: -0.5
          }
        }
      }
    };

    // Simulate API call with delay
    return new Promise<{ data: DashboardData }>((resolve) => {
      setTimeout(() => resolve({ data: mockData }), 500);
    });
  },

  getAgentStatuses: () => {
    // Mock agent statuses for dashboard
    const mockAgentStatuses = [
      { id: '1', status: 'active' },
      { id: '2', status: 'training' },
      { id: '3', status: 'offline' }
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockAgentStatuses }), 300);
    });
  },

  getChartData: (timeframe: 'day' | 'week' | 'month') => {
    // Mock chart data for different time periods
    let data = [];
    const today = new Date();
    
    if (timeframe === 'day') {
      // Hourly data for the day
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          conversations: Math.floor(Math.random() * 5) + 1,
          resolved: Math.floor(Math.random() * 4) + 1
        });
      }
    } else if (timeframe === 'week') {
      // Daily data for the week
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          day: format(date, 'EEE'),
          conversations: Math.floor(Math.random() * 30) + 5,
          resolved: Math.floor(Math.random() * 25) + 5
        });
      }
    } else if (timeframe === 'month') {
      // Weekly data for the month
      for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        data.push({
          week: `Week ${4-i}`,
          conversations: Math.floor(Math.random() * 150) + 50,
          resolved: Math.floor(Math.random() * 120) + 50
        });
      }
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data }), 500);
    });
  }
};