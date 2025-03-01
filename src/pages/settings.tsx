import { useState, useEffect } from 'react';
import { settingsApi } from '@/api/settings-api';
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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  User,
  CreditCard,
  Bell,
  Lock,
  Users,
  Key,
  Upload,
  Check,
  X,
  MoreVertical,
  LogOut,
  Shield,
  Globe,
  Clock,
  Smartphone,
  Laptop,
  Mail,
  MessageSquare,
  Zap,
  Plus,
  Trash,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  
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
}