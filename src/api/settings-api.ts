// Types for settings data
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  timezone: string;
  lastLogin: Date;
  twoFactorEnabled: boolean;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  features: {
    name: string;
    included: boolean;
    limit?: number;
    usage?: number;
  }[];
}

export interface NotificationPreference {
  id: string;
  type: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: Date;
  current: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'active' | 'invited' | 'disabled';
  lastActive?: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  permissions: string[];
}

export interface SettingsData {
  userProfile: UserProfile;
  subscription: Subscription;
  notificationPreferences: NotificationPreference[];
  securitySessions: SecuritySession[];
  teamMembers: TeamMember[];
  apiKeys: ApiKey[];
}

export const settingsApi = {
  getSettingsData: () => {
    // Mock settings data
    const mockData: SettingsData = {
      userProfile: {
        id: 'user1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        role: 'Administrator',
        timezone: 'America/New_York',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        twoFactorEnabled: false
      },
      
      subscription: {
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
        cancelAtPeriodEnd: false,
        features: [
          { name: 'AI Agents', included: true, limit: 10, usage: 3 },
          { name: 'Conversations', included: true, limit: 1000, usage: 128 },
          { name: 'Knowledge Base Size', included: true, limit: 100, usage: 45 },
          { name: 'Team Members', included: true, limit: 5, usage: 3 },
          { name: 'Analytics', included: true },
          { name: 'API Access', included: true },
          { name: 'Priority Support', included: false },
          { name: 'Custom Branding', included: false }
        ]
      },
      
      notificationPreferences: [
        { id: 'new-conversation', type: 'New Conversation', email: true, inApp: true, sms: false },
        { id: 'agent-handoff', type: 'Agent Handoff', email: true, inApp: true, sms: true },
        { id: 'conversation-resolved', type: 'Conversation Resolved', email: true, inApp: true, sms: false },
        { id: 'new-lead', type: 'New Lead Generated', email: true, inApp: true, sms: false },
        { id: 'system-updates', type: 'System Updates', email: true, inApp: true, sms: false },
        { id: 'billing', type: 'Billing Notifications', email: true, inApp: true, sms: false }
      ],
      
      securitySessions: [
        {
          id: 'session1',
          device: 'MacBook Pro',
          browser: 'Chrome 98.0.4758.102',
          ip: '192.168.1.1',
          location: 'New York, USA',
          lastActive: new Date(),
          current: true
        },
        {
          id: 'session2',
          device: 'iPhone 13',
          browser: 'Safari Mobile 15.4',
          ip: '192.168.1.2',
          location: 'New York, USA',
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          current: false
        },
        {
          id: 'session3',
          device: 'Windows PC',
          browser: 'Firefox 97.0.1',
          ip: '192.168.1.3',
          location: 'Boston, USA',
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          current: false
        }
      ],
      
      teamMembers: [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'owner',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          status: 'active',
          lastActive: new Date()
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          status: 'active',
          lastActive: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        {
          id: 'user3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: 'member',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
          status: 'active',
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          id: 'user4',
          name: 'Alice Williams',
          email: 'alice.williams@example.com',
          role: 'viewer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
          status: 'invited'
        }
      ],
      
      apiKeys: [
        {
          id: 'key1',
          name: 'Production API Key',
          key: 'sk_prod_••••••••••••••••••••••••••••••',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          lastUsed: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          permissions: ['read', 'write']
        },
        {
          id: 'key2',
          name: 'Development API Key',
          key: 'sk_dev_••••••••••••••••••••••••••••••',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          permissions: ['read', 'write']
        },
        {
          id: 'key3',
          name: 'Read-only API Key',
          key: 'sk_ro_•••••••••••••••••••••••••••••••',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          permissions: ['read']
        }
      ]
    };

    // Simulate API call with delay
    return new Promise<{ data: SettingsData }>((resolve) => {
      setTimeout(() => resolve({ data: mockData }), 500);
    });
  },

  updateUserProfile: (data: Partial<UserProfile>) => {
    // Simulate updating user profile
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Profile updated successfully' 
        } 
      }), 800);
    });
  },

  updatePassword: (currentPassword: string, newPassword: string) => {
    // Simulate password update
    return new Promise((resolve, reject) => {
      // Mock validation
      if (currentPassword === 'wrongpassword') {
        setTimeout(() => reject({ message: 'Current password is incorrect' }), 800);
      } else {
        setTimeout(() => resolve({ 
          data: { 
            success: true, 
            message: 'Password updated successfully' 
          } 
        }), 800);
      }
    });
  },

  updateNotificationPreferences: (preferences: NotificationPreference[]) => {
    // Simulate updating notification preferences
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Notification preferences updated successfully' 
        } 
      }), 500);
    });
  },

  revokeSession: (sessionId: string) => {
    // Simulate revoking a session
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Session revoked successfully' 
        } 
      }), 500);
    });
  },

  createApiKey: (name: string, permissions: string[]) => {
    // Simulate creating a new API key
    const newKey = {
      id: `key${Date.now()}`,
      name,
      key: `sk_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date(),
      permissions
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'API key created successfully',
          apiKey: newKey
        } 
      }), 800);
    });
  },

  deleteApiKey: (keyId: string) => {
    // Simulate deleting an API key
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'API key deleted successfully' 
        } 
      }), 500);
    });
  },

  inviteTeamMember: (email: string, role: 'admin' | 'member' | 'viewer') => {
    // Simulate inviting a team member
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Invitation sent successfully' 
        } 
      }), 800);
    });
  },

  updateTeamMemberRole: (userId: string, role: 'admin' | 'member' | 'viewer') => {
    // Simulate updating a team member's role
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Role updated successfully' 
        } 
      }), 500);
    });
  },

  removeTeamMember: (userId: string) => {
    // Simulate removing a team member
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        data: { 
          success: true, 
          message: 'Team member removed successfully' 
        } 
      }), 500);
    });
  }
};