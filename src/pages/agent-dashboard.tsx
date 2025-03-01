import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAgentById } from '@/store/slices/agents-slice';
import { agentDashboardApi } from '@/api/agent-dashboard-api';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/format-date';
import {Slider} from '@/components/ui/slider'
import {
  ArrowLeft,
  Edit,
  MessageSquare,
  Clock,
  ThumbsUp,
  AlertTriangle,
  BarChart3,
  Send,
  RefreshCw,
  Search,
  Filter,
  Upload,
  Plus,
  Trash,
  Save,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  ExternalLink,
  Smartphone,
  Mail,
  Calendar,
  CreditCard,
  User,
  Bot
} from 'lucide-react';

export function AgentDashboard() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedAgent, isLoading: agentLoading, error: agentError } = useAppSelector((state) => state.agents);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'agent', content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchAgentById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await agentDashboardApi.getAgentDashboardData(id);
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load agent dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [id]);

  const handleSendMessage = () => {
    if (!testMessage.trim()) return;
    
    // Add user message to conversation
    setConversation([...conversation, { role: 'user', content: testMessage }]);
    setTestMessage('');
    setIsTyping(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      let response = '';
      
      // Generate different responses based on the message content
      if (testMessage.toLowerCase().includes('hello') || testMessage.toLowerCase().includes('hi')) {
        response = `Hello! I'm ${selectedAgent?.name || 'your AI assistant'}. How can I help you today?`;
      } else if (testMessage.toLowerCase().includes('help')) {
        response = `I'd be happy to help! Could you please provide more details about what you need assistance with?`;
      } else if (testMessage.toLowerCase().includes('pricing') || testMessage.toLowerCase().includes('cost')) {
        response = `Our pricing plans start at $9.99/month for the Basic plan, $19.99/month for Pro, and $49.99/month for Enterprise. Each plan includes different features and capabilities. Would you like me to explain the differences?`;
      } else {
        response = `Thank you for your message. I understand you're asking about "${testMessage}". Could you provide more details so I can better assist you?`;
      }
      
      setConversation([...conversation, { role: 'user', content: testMessage }, { role: 'agent', content: response }]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderDocumentStatus = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-500">Processed</Badge>;
      case 'processing':
        return <Badge className="bg-amber-500">Processing</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderIntegrationStatus = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="text-xs text-green-500">Connected</span>;
      case 'disconnected':
        return <span className="text-xs text-muted-foreground">Disconnected</span>;
      case 'error':
        return <span className="text-xs text-destructive">Connection Error</span>;
      default:
        return <span className="text-xs text-muted-foreground">Unknown</span>;
    }
  };

  const filteredDocuments = dashboardData?.knowledgeDocuments.filter((doc: any) => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Loading state
  if ((isLoading && !dashboardData) || (agentLoading && !selectedAgent)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading agent details...</p>
      </div>
    );
  }

  // Error state
  if ((error || agentError) && !selectedAgent) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
        <p className="mb-4 text-center text-muted-foreground">
          We couldn't load the agent details. Please try again.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => dispatch(fetchAgentById(id!))}>
            Retry
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{selectedAgent?.name}</h1>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated {formatDate(selectedAgent?.updatedAt || '')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit Agent</span>
          </Button>
        </div>
      </div>

      {/* Agent Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={selectedAgent?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAgent?.name}`} alt={selectedAgent?.name} />
              <AvatarFallback>
                <Bot className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-bold">{selectedAgent?.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedAgent?.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline" className="bg-primary/5">
                  {selectedAgent?.model}
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Temperature: {selectedAgent?.temperature}
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Max Tokens: {selectedAgent?.maxTokens}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardData?.performanceMetrics.map((metric: any, index: number) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <div className={cn(
                      "rounded-full p-1.5",
                      metric.trend === 'up' && metric.title !== 'Avg. Response Time' && metric.title !== 'Flagged Responses' ? "bg-green-500/10 text-green-500" : 
                      metric.trend === 'down' && (metric.title === 'Avg. Response Time' || metric.title === 'Flagged Responses') ? "bg-green-500/10 text-green-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {index === 0 ? <MessageSquare className="h-5 w-5" /> :
                       index === 1 ? <Clock className="h-5 w-5" /> :
                       index === 2 ? <ThumbsUp className="h-5 w-5" /> :
                       <AlertTriangle className="h-5 w-5" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={cn(
                      "font-medium",
                      (metric.trend === 'up' && metric.title !== 'Avg. Response Time' && metric.title !== 'Flagged Responses') || 
                      (metric.trend === 'down' && (metric.title === 'Avg. Response Time' || metric.title === 'Flagged Responses'))
                        ? "text-green-500" 
                        : "text-red-500"
                    )}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-muted-foreground">vs. previous period</span>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={
                        metric.title === 'Satisfaction Rate'
                          ? parseInt(metric.value.toString().replace('%', ''))
                          : 65
                      } 
                      className="h-1" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* AI Quality and Top Queries */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* AI Quality Checker */}
            <Card>
              <CardHeader>
                <CardTitle>AI Quality Checker</CardTitle>
                <CardDescription>
                  Performance and quality metrics for your agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quality Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Quality Score</h3>
                    <span className="text-sm font-bold text-green-500">92/100</span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-primary/80"
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                
                {/* Ratings Breakdown */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Ratings Breakdown</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-green-500" />
                        <span>Positive</span>
                      </span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        <span>Neutral</span>
                      </span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-1.5 bg-muted [&>div]:bg-amber-500" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span>Negative</span>
                      </span>
                      <span className="font-medium">3%</span>
                    </div>
                    <Progress value={3} className="h-1.5 bg-muted [&>div]:bg-red-500" />
                  </div>
                </div>
                
                {/* Flagged Words/Phrases */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Flagged Phrases</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium">
                      <div>Phrase</div>
                      <div className="text-right">Occurrences</div>
                    </div>
                    {dashboardData?.flaggedPhrases.map((item: any, i: number) => (
                      <div key={i} className="grid grid-cols-2 px-3 py-2 text-sm">
                        <div className="font-medium">{item.phrase}</div>
                        <div className="text-right text-muted-foreground">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Queries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Queries</CardTitle>
                <CardDescription>
                  Most frequent questions asked to your agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b bg-muted/50 px-3 py-2 text-xs font-medium">
                    <div className="col-span-4">Query</div>
                    <div className="text-right">Count</div>
                  </div>
                  {dashboardData?.topQueries.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-5 border-b px-3 py-2 text-sm last:border-0">
                      <div className="col-span-4 font-medium">{item.query}</div>
                      <div className="text-right text-muted-foreground">{item.frequency}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Live Chat Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Testing</CardTitle>
              <CardDescription>
                Test your agent's responses in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b bg-muted/30 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                    Test Mode
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Conversations in test mode are not saved
                  </span>
                </div>
              </div>
              
              <div className="h-[300px] overflow-y-auto p-4">
                {conversation.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                    <MessageSquare className="mb-2 h-10 w-10 opacity-20" />
                    <p>No messages yet</p>
                    <p className="text-sm">Send a message to test your agent</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex gap-2",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === 'agent' && (
                          <Avatar className="mt-0.5 h-8 w-8 flex-shrink-0">
                            <AvatarImage src={selectedAgent?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAgent?.name}`} alt="Avatar" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2",
                          message.role === 'user' 
                            ? "bg-primary text-primary-fore ground" 
                            : "bg-muted"
                        )}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        {message.role === 'user' && (
                          <Avatar className="mt-0.5 h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-2">
                        <Avatar className="mt-0.5 h-8 w-8 flex-shrink-0">
                          <AvatarImage src={selectedAgent?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAgent?.name}`} alt="Avatar" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] rounded-lg bg-muted px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message to test your agent..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!testMessage.trim() || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {conversation.length > 0 && (
                  <div className="mt-2 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setConversation([])}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab Content */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Detailed metrics and analytics for your agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">Conversation Metrics</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Last 7 Days
                    </Button>
                    <Button variant="outline" size="sm">
                      Last 30 Days
                    </Button>
                    <Button variant="outline" size="sm">
                      Custom
                    </Button>
                  </div>
                </div>
                
                <div className="h-[300px] w-full rounded-md border bg-muted/30 p-4">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Conversation volume chart would appear here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <h3 className="mb-4 text-lg font-medium">Response Time</h3>
                  <div className="h-[200px] w-full rounded-md border bg-muted/30 p-4">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Response time chart would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <h3 className="mb-4 text-lg font-medium">User Satisfaction</h3>
                  <div className="h-[200px] w-full rounded-md border bg-muted/30 p-4">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          User satisfaction chart would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-lg font-medium">Conversation Outcomes</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Resolved</p>
                          <p className="text-2xl font-bold">78%</p>
                        </div>
                        <div className="rounded-full bg-green-500/10 p-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Escalated</p>
                          <p className="text-2xl font-bold">15%</p>
                        </div>
                        <div className="rounded-full bg-amber-500/10 p-2">
                          <User className="h-5 w-5 text-amber-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Abandoned</p>
                          <p className="text-2xl font-bold">7%</p>
                        </div>
                        <div className="rounded-full bg-red-500/10 p-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Knowledge Base Tab Content */}
        <TabsContent value="knowledge" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Manage documents and knowledge sources for your agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search documents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  <Button size="sm" className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload Document</span>
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-xs font-medium">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Date Added</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                <ScrollArea className="h-[300px]">
                  {filteredDocuments.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      No documents found
                    </div>
                  ) : (
                    filteredDocuments.map((doc: any) => (
                      <div key={doc.id} className="grid grid-cols-12 border-b px-4 py-3 text-sm last:border-0">
                        <div className="col-span-5 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <div className="col-span-2">
                          {renderDocumentStatus(doc.status)}
                        </div>
                        <div className="col-span-2 text-muted-foreground">{doc.size}</div>
                        <div className="col-span-2 text-muted-foreground">{formatDate(doc.date)}</div>
                        <div className="col-span-1 flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Edit Responses</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Response
                  </Button>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Default Greeting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue={`Hello! I'm ${selectedAgent?.name}, your AI assistant. How can I help you today?`}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm" className="flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Fallback Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue="I'm sorry, I don't have enough information to answer that question. Would you like to speak with a human agent?"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm" className="flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab Content */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Settings</CardTitle>
              <CardDescription>
                Configure your agent's behavior and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name</Label>
                    <Input id="name" defaultValue={selectedAgent?.name} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" defaultValue={selectedAgent?.description} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" defaultValue={selectedAgent?.model} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature">Temperature</Label>
                      <span className="text-sm font-medium">{selectedAgent?.temperature}</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      defaultValue={[selectedAgent?.temperature || 0.7]}
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls randomness: Lower values are more deterministic, higher values more creative
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <span className="text-sm font-medium">{selectedAgent?.maxTokens}</span>
                    </div>
                    <Slider
                      id="maxTokens"
                      min={100}
                      max={2000}
                      step={100}
                      defaultValue={[selectedAgent?.maxTokens || 1000]}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum length of generated responses
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea 
                      id="systemPrompt" 
                      className="min-h-[150px]"
                      defaultValue={selectedAgent?.systemPrompt}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Behavior Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="humanHandoff" className="text-base">Human Handoff</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow conversations to be transferred to human agents
                      </p>
                    </div>
                    <Switch id="humanHandoff" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="collectFeedback" className="text-base">Collect Feedback</Label>
                      <p className="text-sm text-muted-foreground">
                        Ask users to rate responses
                      </p>
                    </div>
                    <Switch id="collectFeedback" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activeStatus" className="text-base">Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this agent available for conversations
                      </p>
                    </div>
                    <Switch id="activeStatus" defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Integrations Tab Content */}
        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect your agent with other platforms and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {dashboardData?.integrations.map((integration: any) => (
                  <Card key={integration.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between border-b p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "rounded-md p-2",
                            integration.enabled ? "bg-primary/10" : "bg-muted"
                          )}>
                            {integration.id === 'whatsapp' ? <Smartphone className="h-5 w-5" /> :
                             integration.id === 'email' ? <Mail className="h-5 w-5" /> :
                             integration.id === 'calendar' ? <Calendar className="h-5 w-5" /> :
                             <CreditCard className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            {renderIntegrationStatus(integration.status)}
                          </div>
                        </div>
                        <Switch checked={integration.enabled} />
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {integration.enabled ? (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor={`${integration.id}-config`}>Configuration</Label>
                                <Input 
                                  id={`${integration.id}-config`} 
                                  placeholder={`${integration.name} API Key`}
                                  type="password"
                                  defaultValue="••••••••••••••••"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Button variant="outline" size="sm">
                                  Test Connection
                                </Button>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Open Dashboard</span>
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-4 text-center">
                              <p className="mb-2 text-sm text-muted-foreground">
                                Connect your {integration.name} account to enable this integration
                              </p>
                              <Button size="sm">
                                Connect {integration.name}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}