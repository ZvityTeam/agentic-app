import { useState, useEffect } from 'react';
import { conversationsApi } from '@/api/conversations-api';
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

export function Conversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'closed' | 'handedOff'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'leads'>('conversations');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'qualified' | 'converted'>('all');
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations and leads on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch conversations
        const conversationsResponse = await conversationsApi.getConversations();
        setConversations(conversationsResponse.data);
        
        // Fetch leads
        const leadsResponse = await conversationsApi.getLeads();
        setLeads(leadsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load conversations and leads');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setIsSending(true);
    
    try {
      // Send message via API
      const response = await conversationsApi.sendMessage(selectedConversation, newMessage, 'human-agent');
      
      // Update conversations state with new message
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation) {
          const newMessageObj = response.data.message;
          
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
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Handle human handoff toggle
  const handleHandoffToggle = async (conversationId: string, handedOff: boolean) => {
    try {
      // Toggle handoff via API
      const response = await conversationsApi.toggleHandoff(conversationId, handedOff);
      
      // Update conversations state
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
    } catch (err) {
      console.error('Error toggling handoff:', err);
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
  const handleUpdateLeadStatus = async (leadId: string, status: 'new' | 'qualified' | 'converted') => {
    try {
      // Update lead status via API
      const response = await conversationsApi.updateLeadStatus(leadId, status);
      
      // Update leads state
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
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  // Render message sender avatar
  const renderMessageAvatar = (message: any, conversation: any) => {
    if (message.sender === 'customer') {
      return (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {conversation.customerName.split(' ').map((n: string) => n[0]).join('')}
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading conversations and leads...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
        <p className="mb-4 text-center text-muted-foreground">
          {error}
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

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
                                {conversation.customerName.split(' ').map((n: string) => n[0]).join('')}
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
                            {currentConversation.customerName.split(' ').map((n: string) => n[0]).join('')}
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
                        {currentConversation.tags.map((tag: string, index: number) => (
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
                        {currentConversation.messages.map((message: any) => (
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
                          disabled={!newMessage.trim() || isSending}
                        >
                          {isSending ? (
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
                              {lead.name.split(' ').map((n: string) => n[0]).join('')}
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