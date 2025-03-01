import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { formatRelativeTime, formatDate } from '@/utils/format-date';
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  MessageSquare,
  Bot,
  User,
  Send,
  MoreVertical,
  Clock,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Trash,
  Archive,
  Star,
  StarOff,
  Phone,
  Mail,
  Briefcase,
  UserCircle,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { format, subDays } from 'date-fns';

// Mock conversation data
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

// Mock leads data extracted from conversations
const mockLeads = mockConversations.map(conv => ({
  id: conv.id,
  name: conv.customerName,
  email: conv.customerEmail,
  phone: conv.customerPhone,
  company: conv.customerCompany,
  source: conv.agentName,
  status: conv.status === 'closed' ? 'converted' : conv.status === 'handedOff' ? 'qualified' : 'new',
  createdAt: conv.messages[0]?.timestamp || new Date(),
  lastContact: conv.lastMessageTime,
  notes: `Lead generated from conversation with ${conv.agentName}`,
  tags: conv.tags
}));

export function Conversations() {
  const [conversations, setConversations] = useState(mockConversations);
  const [leads, setLeads] = useState(mockLeads);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'closed' | 'handedOff'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'leads'>('conversations');
  const [isLoading, setIsLoading] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'qualified' | 'converted'>('all');

  // Get the selected conversation object
  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  // Filter conversations based on search query and status
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    
    const conversationDate = new Date(conv.lastMessageTime);
    const matchesDate = 
      conversationDate >= dateRange.from && 
      conversationDate <= new Date(dateRange.to.getTime() + 86400000); // Include the end date (add 24 hours)
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Filter leads based on search query and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation) {
          const newMessageObj = {
            id: `new-${Date.now()}`,
            sender: 'human-agent',
            content: newMessage,
            timestamp: new Date(),
            read: true
          };
          
          return {
            ...conv,
            messages: [...conv.messages, newMessageObj],
            lastMessage: newMessage,
            lastMessageTime: new Date(),
            unreadCount: 0
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      setNewMessage('');
      setIsLoading(false);
    }, 500);
  };

  // Handle human handoff toggle
  const handleHandoffToggle = (conversationId: string, handedOff: boolean) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        // If turning on handoff, add a system message
        let updatedMessages = [...conv.messages];
        
        if (handedOff && !conv.isHandedOff) {
          updatedMessages.push({
            id: `system-${Date.now()}`,
            sender: 'system',
            content: 'This conversation has been handed off to a human agent.',
            timestamp: new Date(),
            read: true
          });
        }
        
        return {
          ...conv,
          isHandedOff: handedOff,
          status: handedOff ? 'handedOff' : conv.status,
          messages: updatedMessages
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // Update leads status if conversation is handed off
    if (handedOff) {
      const updatedLeads = leads.map(lead => {
        if (lead.id === conversationId) {
          return {
            ...lead,
            status: 'qualified'
          };
        }
        return lead;
      });
      
      setLeads(updatedLeads);
    }
  };

  // Handle starring a conversation
  const handleStarConversation = (conversationId: string) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          isStarred: !conv.isStarred
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
  };

  // Handle updating lead status
  const handleUpdateLeadStatus = (leadId: string, status: 'new' | 'qualified' | 'converted') => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
  };

  // Render message sender avatar
  const renderMessageAvatar = (message: any, conversation: any) => {
    if (message.sender === 'customer') {
      return (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {conversation.customerName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      );
    } else if (message.sender === 'agent') {
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={conversation.agentAvatar} alt={conversation.agentName} />
          <AvatarFallback>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      );
    } else if (message.sender === 'human-agent') {
      return (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      );
    } else {
      return (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted">
            <AlertTriangle className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      );
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      case 'handedOff':
        return <Badge className="bg-blue-500">Handed Off</Badge>;
      default:
        return null;
    }
  };

  // Render lead status badge
  const renderLeadStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-500">New</Badge>;
      case 'qualified':
        return <Badge className="bg-blue-500">Qualified</Badge>;
      case 'converted':
        return <Badge className="bg-purple-500">Converted</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conversations & Leads</h1>
          <p className="text-muted-foreground">
            Manage customer interactions and track leads
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'conversations' | 'leads')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
        
        {/* Conversations Tab Content */}
        <TabsContent value="conversations" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Tabs defaultValue={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <TabsList className="h-9">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="handedOff">Handed Off</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="closed">Closed</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Date Range</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.from,
                          to: dateRange.to
                        }}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setDateRange({ from: range.from, to: range.to });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversations List and Detail View */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Conversations List */}
            <Card className="md:col-span-1">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <CardDescription>
                  {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {filteredConversations.length === 0 ? (
                    <div className="flex h-20 items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      No conversations found
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={cn(
                          "cursor-pointer border-b p-4 transition-colors hover:bg-muted/50",
                          selectedConversation === conversation.id && "bg-muted",
                          conversation.unreadCount > 0 && "border-l-4 border-l-primary"
                        )}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {conversation.customerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{conversation.customerName}</h3>
                                {conversation.isStarred && (
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>{conversation.agentName}</span>
                                <span>•</span>
                                <span>{formatRelativeTime(conversation.lastMessageTime)}</span>
                              </div>
                              <p className="mt-1 line-clamp-1 text-sm">
                                {conversation.lastMessage}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {renderStatusBadge(conversation.status)}
                            {conversation.unreadCount > 0 && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Conversation Detail */}
            <Card className="md:col-span-2">
              {selectedConversation && currentConversation ? (
                <>
                  <CardHeader className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {currentConversation.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{currentConversation.customerName}</CardTitle>
                            {renderStatusBadge(currentConversation.status)}
                          </div>
                          <CardDescription>
                            {currentConversation.customerEmail} • {currentConversation.customerPhone}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStarConversation(currentConversation.id)}
                        >
                          {currentConversation.isStarred ? (
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Conversation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {currentConversation.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Human Handoff:</span>
                        <Switch
                          checked={currentConversation.isHandedOff}
                          onCheckedChange={(checked) => handleHandoffToggle(currentConversation.id, checked)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <div className="flex h-[400px] flex-col">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {currentConversation.messages.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            {renderMessageAvatar(message, currentConversation)}
                            <div className={cn(
                              "max-w-[80%] rounded-lg px-4 py-2",
                              message.sender === 'customer' 
                                ? "bg-muted" 
                                : message.sender === 'system'
                                  ? "bg-muted/50 italic text-muted-foreground"
                                  : "bg-primary/10"
                            )}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">
                                  {message.sender === 'customer' 
                                    ? currentConversation.customerName 
                                    : message.sender === 'agent'
                                      ? currentConversation.agentName
                                      : message.sender === 'human-agent'
                                        ? 'Human Agent'
                                        : 'System'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(message.timestamp), 'h:mm a')}
                                </span>
                              </div>
                              <p className="mt-1 text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          className="h-auto" 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {currentConversation.isHandedOff 
                              ? 'Human agent mode active' 
                              : 'AI agent handling conversation'}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-[500px] flex-col items-center justify-center p-4 text-center">
                  <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">No Conversation Selected</h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Select a conversation from the list to view details and respond to messages
                  </p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        {/* Leads Tab Content */}
        <TabsContent value="leads" className="space-y-4">
          {/* Leads Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search leads..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Tabs defaultValue={leadStatusFilter} onValueChange={(value) => setLeadStatusFilter(value as any)}>
                    <TabsList className="h-9">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="new">New</TabsTrigger>
                      <TabsTrigger value="qualified">Qualified</TabsTrigger>
                      <TabsTrigger value="converted">Converted</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        <span>Export</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Export as Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Leads</CardTitle>
                  <CardDescription>
                    {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} collected from conversations
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Leads
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-xs font-medium">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Contact</div>
                  <div className="col-span-2">Company</div>
                  <div className="col-span-2">Source</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                
                <ScrollArea className="h-[500px]">
                  {filteredLeads.length === 0 ? (
                    <div className="flex h-20 items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      No leads found
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="grid grid-cols-12 items-center border-b px-4 py-3 text-sm last:border-0"
                      >
                        <div className="col-span-3 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Created {formatRelativeTime(lead.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{lead.phone}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-muted-foreground" />
                            <span>{lead.company}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <Bot className="h-3 w-3 text-muted-foreground" />
                            <span>{lead.source}</span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          {renderLeadStatusBadge(lead.status)}
                        </div>
                        <div className="col-span-2 flex justify-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Update Status
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateLeadStatus(lead.id, 'new')}>
                                <Badge className="mr-2 bg-green-500">New</Badge>
                                Mark as New
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateLeadStatus(lead.id, 'qualified')}>
                                <Badge className="mr-2 bg-blue-500">Qualified</Badge>
                                Mark as Qualified
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateLeadStatus(lead.id, 'converted')}>
                                <Badge className="mr-2 bg-purple-500">Converted</Badge>
                                Mark as Converted
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedConversation(lead.id);
                              setActiveTab('conversations');
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Lead Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Lead Sources</h3>
                    <p className="text-sm text-muted-foreground">Top performing agents</p>
                  </div>
                  <UserCircle className="h-8 w-8 text-primary/50" />
                </div>
                <div className="mt-4 space-y-2">
                  {Array.from(new Set(leads.map(lead => lead.source))).map((source, index) => {
                    const count = leads.filter(lead => lead.source === source).length;
                    const percentage = Math.round((count / leads.length) * 100);
                    
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{source}</span>
                          <span className="font-medium">{count} leads ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Lead Status</h3>
                    <p className="text-sm text-muted-foreground">Conversion pipeline</p>
                  </div>
                  <ArrowRight className="h-8 w-8 text-primary/50" />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">
                      {leads.filter(lead => lead.status === 'new').length}
                    </div>
                    <p className="text-sm text-muted-foreground">New</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">
                      {leads.filter(lead => lead.status === 'qualified').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Qualified</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">
                      {leads.filter(lead => lead.status === 'converted').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Converted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Lead Quality</h3>
                    <p className="text-sm text-muted-foreground">Data completeness</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary/50" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Name</span>
                    <Badge className="bg-green-500">100%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <Badge className="bg-green-500">100%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone</span>
                    <Badge className="bg-green-500">100%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Company</span>
                    <Badge className="bg-green-500">100%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}