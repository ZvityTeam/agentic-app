import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { settingsApi } from '@/api/settings-api';
import { useAppSelector } from '@/hooks/redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  User,
  Bell,
  Lock,
  Users,
  Key,
  Upload,
  Check,
  X,
  MoreVertical,
  LogOut,
  Smartphone,
  Laptop,
  MessageSquare,
  Zap,
  Plus,
  Trash,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronRight,
    Info,
    AlertTriangle,
    CreditCard,
  Calendar,
  Clock,
  Globe,
    Shield,
    Mail,
  Settings as SettingsIcon,
} from 'lucide-react';

export function Settings() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    timezone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: {
      newMessages: true,
      agentUpdates: true,
      weeklyReports: true,
      securityAlerts: true,
      marketingEmails: false,
    },
    inAppNotifications: {
      newMessages: true,
      agentUpdates: true,
      weeklyReports: false,
      securityAlerts: true,
    },
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    }
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    apiKeys: [
      { 
        id: 'key_1', 
        name: 'Production API Key', 
        lastUsed: '2025-03-15T10:30:00Z',
        created: '2025-01-10T14:20:00Z',
        prefix: 'sk_live_',
        hidden: true
      },
      { 
        id: 'key_2', 
        name: 'Development API Key', 
        lastUsed: '2025-03-17T16:45:00Z',
        created: '2025-02-05T09:15:00Z',
        prefix: 'sk_test_',
        hidden: true
      }
    ],
    sessions: [
      {
        id: 'session_1',
        device: 'Chrome on MacBook Pro',
        location: 'San Francisco, CA',
        lastActive: '2025-03-18T14:30:00Z',
        ip: '192.168.1.1',
        isCurrent: true
      },
      {
        id: 'session_2',
        device: 'Safari on iPhone 15',
        location: 'San Francisco, CA',
        lastActive: '2025-03-17T10:15:00Z',
        ip: '192.168.1.2',
        isCurrent: false
      },
      {
        id: 'session_3',
        device: 'Firefox on Windows PC',
        location: 'New York, NY',
        lastActive: '2025-03-15T08:45:00Z',
        ip: '192.168.1.3',
        isCurrent: false
      }
    ]
  });

  // Subscription data
  const subscriptionData = {
    currentPlan: {
      name: 'Pro',
      price: '$49',
      billingCycle: 'monthly',
      nextBillingDate: '2025-04-15',
      status: 'active',
      features: [
        '10 AI Agents',
        'Advanced Analytics',
        'Custom Branding',
        'API Access',
        'Email Support'
      ]
    },
    usage: {
      agents: { used: 6, total: 10, percentage: 60 },
      conversations: { used: 2450, total: 5000, percentage: 49 },
      storage: { used: 2.1, total: 5, percentage: 42 },
      apiCalls: { used: 15600, total: 50000, percentage: 31 }
    },
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        price: '$19',
        billingCycle: 'monthly',
        features: [
          '3 AI Agents',
          'Basic Analytics',
          'Standard Support'
        ],
        recommended: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$49',
        billingCycle: 'monthly',
        features: [
          '10 AI Agents',
          'Advanced Analytics',
          'Custom Branding',
          'API Access',
          'Email Support'
        ],
        recommended: false,
        current: true
      },
      {
        id: 'business',
        name: 'Business',
        price: '$99',
        billingCycle: 'monthly',
        features: [
          'Unlimited AI Agents',
          'Premium Analytics',
          'Custom Branding',
          'Advanced API Access',
          'Priority Support',
          'Team Management',
          'Custom Integrations'
        ],
        recommended: true
      }
    ]
  };

  // Team members data
  const teamMembers = [
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      lastActive: '2025-03-18T14:30:00Z'
    },
    {
      id: 'user_2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      lastActive: '2025-03-17T10:15:00Z'
    },
    {
      id: 'user_3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Viewer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      lastActive: '2025-03-15T08:45:00Z'
    }
  ];

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setIsLoading(true);
        const response = await settingsApi.getSettingsData();
        setSettingsData(response.data);
        
        // Initialize form data
        setProfileData({
          name: response.data.userProfile.name,
          email: response.data.userProfile.email,
          timezone: response.data.userProfile.timezone,
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load settings data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettingsData();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'confirmPassword' || name === 'newPassword') {
      if (name === 'confirmPassword' && value !== passwordData.newPassword) {
        setPasswordError('Passwords do not match');
      } else if (name === 'newPassword' && passwordData.confirmPassword && value !== passwordData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  // Handle quiet hours toggle
  const handleQuietHoursToggle = (checked: boolean) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: checked
      }
    }));
  };

  // Handle quiet hours time change
  const handleQuietHoursTimeChange = (type: string, value: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [type]: value
      }
    }));
  };

  // Handle 2FA toggle
  const handle2FAToggle = (checked: boolean) => {
    setSecuritySettings((prev) => ({
      ...prev,
      twoFactorEnabled: checked
    }));
  };

  // Handle API key visibility toggle
  const toggleApiKeyVisibility = (id: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map(key => 
        key.id === id ? { ...key, hidden: !key.hidden } : key
      )
    }));
  };

  // Handle session termination
  const terminateSession = (id: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      sessions: prev.sessions.filter(session => session.id !== id)
    }));
    toast.success("Session terminated successfully");
  };

  // Handle API key generation
  const generateNewApiKey = () => {
    setIsGeneratingKey(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKey = {
        id: `key_${Date.now()}`,
        name: 'New API Key',
        lastUsed: new Date().toISOString(),
        created: new Date().toISOString(),
        prefix: 'sk_live_',
        hidden: false
      };
      
      setSecuritySettings((prev) => ({
        ...prev,
        apiKeys: [...prev.apiKeys, newKey]
      }));
      
      setIsGeneratingKey(false);
      toast.success("New API key generated successfully");
    }, 1500);
  };

  // Handle profile save
  const handleProfileSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully");
    }, 1500);
  };

  // Handle password save
  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success("Password updated successfully");
    }, 1500);
  };

    // Handle avatar upload
  const handleAvatarUpload = () => {
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Avatar uploaded successfully");
    }, 2000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await settingsApi.updateUserProfile(profileData);
      
      // Update local state
      setSettingsData(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          ...profileData
        }
      }));
      
      // Show success message (you could use a toast here)
      console.log('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await settingsApi.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Show success message (you could use a toast here)
      console.log('Password updated successfully');
    } catch (err) {
      console.error('Failed to update password', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationToggle = (id: string, type: 'email' | 'inApp' | 'sms', value: boolean) => {
    if (!settingsData) return;
    
    // Update local state
    const updatedPreferences = settingsData.notificationPreferences.map((pref: any) => {
      if (pref.id === id) {
        return { ...pref, [type]: value };
      }
      return pref;
    });
    
    setSettingsData(prev => ({
      ...prev,
      notificationPreferences: updatedPreferences
    }));
    
    // Update on server
    settingsApi.updateNotificationPreferences(updatedPreferences);
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await settingsApi.revokeSession(sessionId);
      
      // Update local state
      const updatedSessions = settingsData.securitySessions.filter(
        (session: any) => session.id !== sessionId
      );
      
      setSettingsData(prev => ({
        ...prev,
        securitySessions: updatedSessions
      }));
      
      // Show success message
      console.log('Session revoked successfully');
    } catch (err) {
      console.error('Failed to revoke session', err);
    }
  };

    const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  // Loading state
  if (isLoading && !settingsData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading settings...</p>
      </div>
    );
  }

  // Error state
  if (error && !settingsData) {
    return (
      <>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
        <p className="mb-4 text-center text-muted-foreground">
          We couldn't load your settings. Please try again.
        </p>
      </div>
      </>
    )
  }


return(
  <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-muted">
                      <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt={user?.name} />
                      <AvatarFallback className="text-2xl">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <Button 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={handleAvatarUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Last login: {format(new Date(), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                      <Badge className="shrink-0 bg-green-500">Verified</Badge>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={profileData.company}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={profileData.jobTitle}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={profileData.timezone} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Your current timezone is used for notifications and reporting
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleProfileSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Password Card */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                {passwordData.newPassword && passwordData.confirmPassword && 
                 passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-sm text-destructive">Passwords do not match</p>
                )}
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button 
                onClick={handlePasswordSave} 
                disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || 
                          !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Your current subscription and usage
                  </CardDescription>
                </div>
                <Badge className="bg-primary">
                  {subscriptionData.currentPlan.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {subscriptionData.currentPlan.name} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subscriptionData.currentPlan.price}/month • Renews on {subscriptionData.currentPlan.nextBillingDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      Manage Billing
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium">Features</h4>
                    <ul className="space-y-2">
                      {subscriptionData.currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="mb-2 font-medium">Usage</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>AI Agents</span>
                          <span className="font-medium">
                            {subscriptionData.usage.agents.used} / {subscriptionData.usage.agents.total}
                          </span>
                        </div>
                        <Progress value={subscriptionData.usage.agents.percentage} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Conversations</span>
                          <span className="font-medium">
                            {subscriptionData.usage.conversations.used} / {subscriptionData.usage.conversations.total}
                          </span>
                        </div>
                        <Progress value={subscriptionData.usage.conversations.percentage} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Storage (GB)</span>
                          <span className="font-medium">
                            {subscriptionData.usage.storage.used} / {subscriptionData.usage.storage.total}
                          </span>
                        </div>
                        <Progress value={subscriptionData.usage.storage.percentage} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>API Calls</span>
                          <span className="font-medium">
                            {subscriptionData.usage.apiCalls.used} / {subscriptionData.usage.apiCalls.total}
                          </span>
                        </div>
                        <Progress value={subscriptionData.usage.apiCalls.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Plans</h2>
              <Select defaultValue="monthly">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Billing Cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Billing</SelectItem>
                  <SelectItem value="annual">Annual Billing (Save 20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {subscriptionData.plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={cn(
                    "relative overflow-hidden transition-all",
                    plan.recommended && "border-primary shadow-md",
                    plan.current && "bg-muted/50"
                  )}
                >
                  {plan.recommended && (
                    <div className="absolute right-0 top-0">
                      <div className="bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Recommended
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">/{plan.billingCycle}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    {plan.current ? (
                      <Button className="w-full" variant="outline" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        className={cn("w-full", plan.recommended && "bg-primary")} 
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Upgrading...
                          </>
                        ) : (
                          <>Upgrade</>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="rounded-md border border-dashed p-4">
              <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                <div>
                  <h3 className="text-lg font-semibold">Need a custom plan?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our sales team for a tailored solution that fits your specific requirements
                  </p>
                </div>
                <Button variant="outline">Contact Sales</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Manage the emails you receive from us
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when you get new messages from users
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.emailNotifications.newMessages}
                    onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', 'newMessages', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Agent Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about updates to your AI agents
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.emailNotifications.agentUpdates}
                    onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', 'agentUpdates', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly performance reports for your agents
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.emailNotifications.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', 'weeklyReports', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get important security notifications about your account
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.emailNotifications.securityAlerts}
                    onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', 'securityAlerts', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.emailNotifications.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', 'marketingEmails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>
                Manage your in-app notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications for new messages
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.inAppNotifications.newMessages}
                    onCheckedChange={(checked) => handleNotificationToggle('inAppNotifications', 'newMessages', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Agent Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications for agent updates
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.inAppNotifications.agentUpdates}
                    onCheckedChange={(checked) => handleNotificationToggle('inAppNotifications', 'agentUpdates', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications for weekly reports
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.inAppNotifications.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationToggle('inAppNotifications', 'weeklyReports', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications for security alerts
                    </p>
                  </div>
                  <Switch 
                    checked={notificationPreferences.inAppNotifications.securityAlerts}
                    onCheckedChange={(checked) => handleNotificationToggle('inAppNotifications', 'securityAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>
                Set times when you don't want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Quiet Hours</Label>
                  <p className="text-sm text-muted-foreground">
                    Pause notifications during specific hours
                  </p>
                </div>
                <Switch 
                  checked={notificationPreferences.quietHours.enabled}
                  onCheckedChange={handleQuietHoursToggle}
                />
              </div>
              
              {notificationPreferences.quietHours.enabled && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={notificationPreferences.quietHours.startTime}
                      onChange={(e) => handleQuietHoursTimeChange('startTime', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={notificationPreferences.quietHours.endTime}
                      onChange={(e) => handleQuietHoursTimeChange('endTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Quiet hours are based on your current timezone ({profileData.timezone})
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Notification preferences saved")}>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch 
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={handle2FAToggle}
                />
              </div>
              
              {securitySettings.twoFactorEnabled && (
                <div className="mt-4 rounded-md border p-4">
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    <div className="h-32 w-32 rounded-md border bg-muted p-2">
                      <div className="flex h-full items-center justify-center">
                        <p className="text-center text-sm text-muted-foreground">QR Code would appear here</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-medium">Set up authenticator app</h3>
                        <p className="text-sm text-muted-foreground">
                          Scan this QR code with your authenticator app (like Google Authenticator, Authy, or 1Password)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <div className="flex gap-2">
                          <Input
                            id="verificationCode"
                            placeholder="Enter 6-digit code"
                          />
                          <Button>Verify</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium">Recovery Codes</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Save these backup codes in a secure place to use if you lose access to your authenticator app
                    </p>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="rounded-md bg-muted p-2 text-center text-sm font-mono">
                          XXXX-XXXX
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm">
                        Download Codes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices where you're currently logged in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securitySettings.sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={cn(
                      "flex items-center justify-between rounded-md border p-4",
                      session.isCurrent && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "rounded-full p-2",
                        session.isCurrent ? "bg-primary/10" : "bg-muted"
                      )}>
                        {session.device.includes('iPhone') || session.device.includes('Android') ? (
                          <Smartphone className="h-5 w-5" />
                        ) : (
                          <Laptop className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.device}</p>
                          {session.isCurrent && (
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <p>{session.location}</p>
                          <p>•</p>
                          <p>IP: {session.ip}</p>
                          <p>•</p>
                          <p>Last active: {formatRelativeTime(session.lastActive)}</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => terminateSession(session.id)}
                      disabled={session.isCurrent}
                    >
                      {session.isCurrent ? "Current Session" : "Sign Out"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setSecuritySettings(prev => ({
                    ...prev,
                    sessions: prev.sessions.filter(session => session.isCurrent)
                  }));
                  toast.success("Signed out from all other devices");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out From All Other Devices
              </Button>
            </CardFooter>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for accessing our services programmatically
                  </CardDescription>
                </div>
                <Button 
                  onClick={generateNewApiKey}
                  disabled={isGeneratingKey}
                >
                  {isGeneratingKey ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Generate New Key
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securitySettings.apiKeys.map((key) => (
                  <div key={key.id} className="rounded-md border p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{key.name}</h3>
                          <Badge variant="outline">
                            {key.prefix.includes('live') ? 'Production' : 'Development'}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono">
                            {key.hidden ? `${key.prefix}${'•'.repeat(12)}` : `${key.prefix}abcdef123456`}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => toggleApiKeyVisibility(key.id)}
                          >
                            {key.hidden ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => {
                              navigator.clipboard.writeText(`${key.prefix}abcdef123456`);
                              toast.success("API key copied to clipboard");
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Created: {formatDate(key.created)} • Last used: {formatRelativeTime(key.lastUsed)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-3 w-3" />
                          Rotate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setSecuritySettings(prev => ({
                              ...prev,
                              apiKeys: prev.apiKeys.filter(k => k.id !== key.id)
                            }));
                            toast.success("API key revoked successfully");
                          }}
                        >
                          <Trash className="mr-2 h-3 w-3" />
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {securitySettings.apiKeys.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-6">
                    <Key className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium">No API Keys</h3>
                    <p className="mb-4 text-center text-sm text-muted-foreground">
                      You haven't created any API keys yet
                    </p>
                    <Button 
                      onClick={generateNewApiKey}
                      disabled={isGeneratingKey}
                    >
                      {isGeneratingKey ? "Generating..." : "Generate API Key"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="rounded-md bg-muted p-3 w-full">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-muted-foreground">
                    API keys provide full access to your account. Keep them secure and never share them in public repositories or client-side code.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your team and their permissions
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-xs font-medium">
                  <div className="col-span-5">User</div>
                  <div className="col-span-3">Role</div>
                  <div className="col-span-3">Last Active</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                <ScrollArea className="h-[300px]">
                  {teamMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="grid grid-cols-12 items-center border-b px-4 py-3 text-sm last:border-0"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            member.role === 'Admin' ? "bg-primary/10 text-primary" :
                            member.role === 'Editor' ? "bg-blue-500/10 text-blue-500" :
                            "bg-muted text-muted-foreground"
                          )}
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <div className="col-span-3 text-muted-foreground">
                        {formatRelativeTime(member.lastActive)}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-48">
                            <div className="space-y-1">
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                <SettingsIcon className="mr-2 h-4 w-4" />
                                Edit Role
                              </Button>
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Resend Invite
                              </Button>
                              <Separator />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Track and manage sent invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-dashed p-6 text-center">
                <Mail className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium">No Pending Invitations</h3>
                <p className="text-sm text-muted-foreground">
                  All invitations have been accepted or expired
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Team Settings</CardTitle>
              <CardDescription>
                Configure team-wide settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Team Name</Label>
                  <p className="text-sm text-muted-foreground">
                    The name of your team or organization
                  </p>
                </div>
                <div className="w-[250px]">
                  <Input defaultValue="Acme Inc." />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Default Role</Label>
                  <p className="text-sm text-muted-foreground">
                    The default role assigned to new team members
                  </p>
                </div>
                <div className="w-[250px]">
                  <Select defaultValue="viewer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Require admin approval for new team members
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Resource Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow team members to share resources with each other
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => toast.success("Team settings saved")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>

          {/* Coming Soon */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                New team management features in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-medium">Role Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Create custom role templates with specific permissions
                  </p>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-medium">SSO Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with your identity provider for seamless login
                  </p>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-medium">Activity Audit</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed logs of all team member activities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
)
}