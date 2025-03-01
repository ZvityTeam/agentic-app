import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  MessageSquare,
  Clock,
  Users,
  FileText,
  Lightbulb,
  Sparkles,
  Flame,
  Search,
  Plus,
  HelpCircle,
  Info,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { format, subDays } from 'date-fns';

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('7d');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(format(new Date(), 'MMM d, yyyy h:mm a'));

  // Mock data for the dashboard
  const performanceMetrics = [
    { 
      title: 'Total Conversations', 
      value: 1248, 
      change: 12, 
      trend: 'up',
      icon: <MessageSquare className="h-5 w-5" /> 
    },
    { 
      title: 'Resolution Rate', 
      value: '87%', 
      change: 5, 
      trend: 'up',
      icon: <CheckCircle2 className="h-5 w-5" /> 
    },
    { 
      title: 'Avg. Response Time', 
      value: '1.2s', 
      change: -8, 
      trend: 'down',
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      title: 'User Satisfaction', 
      value: '92%', 
      change: 3, 
      trend: 'up',
      icon: <ThumbsUp className="h-5 w-5" /> 
    },
  ];

  const qualityMetrics = {
    upvotes: 856,
    downvotes: 74,
    ratio: 92,
    categories: [
      { name: 'Product Info', upvotes: 312, downvotes: 18, ratio: 95 },
      { name: 'Technical Support', upvotes: 245, downvotes: 32, ratio: 88 },
      { name: 'Pricing', upvotes: 178, downvotes: 12, ratio: 94 },
      { name: 'Shipping', upvotes: 121, downvotes: 12, ratio: 91 },
    ]
  };

  const flaggedPhrases = [
    { phrase: 'I don\'t know', count: 28, severity: 'high' },
    { phrase: 'I can\'t help with that', count: 19, severity: 'high' },
    { phrase: 'That\'s not possible', count: 15, severity: 'medium' },
    { phrase: 'You need to contact support', count: 12, severity: 'medium' },
    { phrase: 'I don\'t have that information', count: 10, severity: 'low' },
  ];

  const weakResponses = [
    { 
      query: 'How do I reset my password?', 
      response: 'You should see a reset password link on the login page.',
      frequency: 8,
      suggestion: 'Provide step-by-step instructions with a direct link to the password reset page.'
    },
    { 
      query: 'When will my order arrive?', 
      response: 'Shipping usually takes 3-5 business days.',
      frequency: 6,
      suggestion: 'Offer to check the specific order status and provide tracking information.'
    },
    { 
      query: 'Do you offer refunds?', 
      response: 'Yes, we have a refund policy.',
      frequency: 5,
      suggestion: 'Explain the refund policy details and link to the full policy page.'
    },
  ];

  const aiQualityRatings = {
    overall: 87,
    accuracy: 92,
    tone: 89,
    helpfulness: 85,
    benchmark: 82
  };

  const knowledgeGaps = [
    { query: 'How do I integrate with Shopify?', frequency: 24, trend: 'up' },
    { query: 'What payment methods do you accept in Europe?', frequency: 18, trend: 'up' },
    { query: 'Can I use your API with Python?', frequency: 15, trend: 'stable' },
    { query: 'Do you offer volume discounts?', frequency: 12, trend: 'down' },
  ];

  const actionableInsights = [
    { 
      title: 'Improve password reset responses',
      description: 'Current responses lack clear steps and direct links',
      impact: 'High',
      effort: 'Low',
      suggestion: 'Add step-by-step instructions with direct links'
    },
    { 
      title: 'Add Shopify integration documentation',
      description: 'Frequent questions about Shopify integration process',
      impact: 'High',
      effort: 'Medium',
      suggestion: 'Create dedicated Shopify integration guide'
    },
    { 
      title: 'Clarify European payment methods',
      description: 'Users confused about available payment options in Europe',
      impact: 'Medium',
      effort: 'Low',
      suggestion: 'Update FAQ and agent knowledge base with region-specific payment info'
    },
  ];

  // Agents list for the dropdown
  const agents = [
    { id: 'all', name: 'All Agents' },
    { id: '1', name: 'Customer Support Agent' },
    { id: '2', name: 'Sales Assistant' },
    { id: '3', name: 'Technical Support Agent' },
    { id: '4', name: 'Onboarding Specialist' },
  ];

  // Handle date range selection
  const handleDateRangeChange = (range: '7d' | '30d' | '90d' | 'custom') => {
    setDateRange(range);
    
    if (range !== 'custom') {
      const end = new Date();
      let start;
      
      switch (range) {
        case '7d':
          start = subDays(end, 7);
          break;
        case '30d':
          start = subDays(end, 30);
          break;
        case '90d':
          start = subDays(end, 90);
          break;
      }
      
      setStartDate(start);
      setEndDate(end);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(format(new Date(), 'MMM d, yyyy h:mm a'));
    }, 1500);
  };

  // Helper function to render trend indicators
  const renderTrend = (trend: string, change: number, inverse: boolean = false) => {
    const isPositive = trend === 'up';
    const isGood = inverse ? !isPositive : isPositive;
    
    return (
      <div className={cn(
        "flex items-center gap-1 text-xs",
        isGood ? "text-green-500" : "text-red-500"
      )}>
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  // Helper function to render severity badges
  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  // Helper function to render trend indicators for knowledge gaps
  const renderKnowledgeTrend = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <Separator orientation="horizontal" className="w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Quality</h1>
          <p className="text-muted-foreground">
            Monitor performance and improve your AI agents
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-3 w-3" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div>
                <Label htmlFor="date-range" className="text-xs">Date Range</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={dateRange === '7d' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDateRangeChange('7d')}
                  >
                    7d
                  </Button>
                  <Button 
                    variant={dateRange === '30d' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDateRangeChange('30d')}
                  >
                    30d
                  </Button>
                  <Button 
                    variant={dateRange === '90d' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDateRangeChange('90d')}
                  >
                    90d
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant={dateRange === 'custom' ? 'default' : 'outline'} 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        {dateRange === 'custom' ? (
                          <>
                            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
                          </>
                        ) : (
                          'Custom'
                        )}
                        <CalendarIcon className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium">Custom Range</h4>
                          <div className="flex items-center gap-2">
                            <div>
                              <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => {
                                  if (date) {
                                    setStartDate(date);
                                    setDateRange('custom');
                                  }
                                }}
                                disabled={(date) => date > endDate || date > new Date()}
                                initialFocus
                              />
                            </div>
                            <div>
                              <Label htmlFor="end-date" className="text-xs">End Date</Label>
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => {
                                  if (date) {
                                    setEndDate(date);
                                    setDateRange('custom');
                                  }
                                }}
                                disabled={(date) => date < startDate || date > new Date()}
                                initialFocus
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="min-w-[180px]">
                <Label htmlFor="agent-select" className="text-xs">Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger id="agent-select">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40" align="end">
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Export as CSV
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Export as PDF
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Export as JSON
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <div className={cn(
                    "rounded-full p-1.5",
                    metric.trend === 'up' && metric.title !== 'Avg. Response Time' ? "bg-green-500/10 text-green-500" : 
                    metric.trend === 'down' && metric.title === 'Avg. Response Time' ? "bg-green-500/10 text-green-500" :
                    "bg-red-500/10 text-red-500"
                  )}>
                    {metric.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {renderTrend(
                    metric.trend, 
                    metric.change, 
                    metric.title === 'Avg. Response Time'
                  )}
                  <span className="text-muted-foreground">vs. previous period</span>
                </div>
                <div className="mt-2">
                  <Progress 
                    value={
                      metric.title === 'Resolution Rate' || metric.title === 'User Satisfaction'
                        ? parseInt(metric.value.replace('%', ''))
                        : 65
                    } 
                    className="h-1" 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Conversation Trend Graph */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Conversation Trends</CardTitle>
                <CardDescription>
                  Volume and engagement metrics over time
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  <div className="mr-1 h-2 w-2 rounded-full bg-primary"></div>
                  Conversations
                </Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
                  Resolved
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  <div className="mr-1 h-2 w-2 rounded-full bg-amber-500"></div>
                  Escalated
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <LineChart className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Conversation trend chart would appear here
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Checker Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quality Checker</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Up/Down Vote Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
              <CardDescription>
                Up/down votes and satisfaction metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">{qualityMetrics.upvotes}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">{qualityMetrics.downvotes}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{qualityMetrics.ratio}%</div>
                  <p className="text-xs text-muted-foreground">Positive Ratio</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">+3%</span>
                  <span className="text-xs text-muted-foreground">vs. prev.</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Feedback by Category</h3>
                {qualityMetrics.categories.map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.ratio}%</span>
                        <div className="flex items-center gap-1 text-xs">
                          <ThumbsUp className="h-3 w-3 text-green-500" />
                          <span>{category.upvotes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <ThumbsDown className="h-3 w-3 text-red-500" />
                          <span>{category.downvotes}</span>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={category.ratio} 
                      className="h-1.5" 
                      indicatorClassName={cn(
                        category.ratio >= 90 ? "bg-green-500" :
                        category.ratio >= 80 ? "bg-amber-500" :
                        "bg-red-500"
                      )}
                    />
                  </div>
                ))}
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Feedback is collected from user ratings after conversations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* AI-based Quality Rating */}
          <Card>
            <CardHeader>
              <CardTitle>AI Quality Rating</CardTitle>
              <CardDescription>
                Automated quality assessment metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative h-36 w-36">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{aiQualityRatings.overall}</div>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  </div>
                  <div className="h-full w-full">
                    <PieChart className="h-full w-full text-primary opacity-20" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Accuracy</span>
                    </div>
                    <span className="font-medium">{aiQualityRatings.accuracy}/100</span>
                  </div>
                  <Progress value={aiQualityRatings.accuracy} className="h-1.5" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Tone & Style</span>
                    </div>
                    <span className="font-medium">{aiQualityRatings.tone}/100</span>
                  </div>
                  <Progress value={aiQualityRatings.tone} className="h-1.5" indicatorClassName="bg-green-500" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Helpfulness</span>
                    </div>
                    <span className="font-medium">{aiQualityRatings.helpfulness}/100</span>
                  </div>
                  <Progress value={aiQualityRatings.helpfulness} className="h-1.5" indicatorClassName="bg-blue-500" />
                </div>
              </div>
              
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Benchmark Comparison</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{aiQualityRatings.overall - aiQualityRatings.benchmark}pts</span>
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div 
                        className="absolute h-2 rounded-full bg-muted-foreground" 
                        style={{ width: `${aiQualityRatings.benchmark}%` }}
                      ></div>
                      <div 
                        className="absolute h-2 rounded-full bg-primary" 
                        style={{ width: `${aiQualityRatings.overall}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                      <span>Benchmark</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Your Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Flagged Words & Responses */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Flagged Words */}
          <Card>
            <CardHeader>
              <CardTitle>Flagged Phrases</CardTitle>
              <CardDescription>
                Problematic terms and expressions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-3 py-2 text-xs font-medium">
                    <div className="col-span-6">Phrase</div>
                    <div className="col-span-3 text-center">Count</div>
                    <div className="col-span-3 text-right">Severity</div>
                  </div>
                  <ScrollArea className="h-[200px]">
                    {flaggedPhrases.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 border-b px-3 py-2 text-sm last:border-0">
                        <div className="col-span-6 font-medium">{item.phrase}</div>
                        <div className="col-span-3 text-center">{item.count}</div>
                        <div className="col-span-3 flex justify-end">
                          {renderSeverityBadge(item.severity)}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <p className="text-xs">
                      <span className="font-medium">Heat map:</span> Phrases are flagged based on frequency and impact on user satisfaction
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Weak Responses */}
          <Card>
            <CardHeader>
              <CardTitle>Weak Responses</CardTitle>
              <CardDescription>
                Responses that need improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-4">
                  {weakResponses.map((item, i) => (
                    <div key={i} className="rounded-md border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{item.query}</h3>
                        <Badge variant="outline">
                          {item.frequency} occurrences
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="rounded-md bg-muted p-2">
                          <p className="text-sm text-muted-foreground">{item.response}</p>
                        </div>
                        <div className="flex items-start gap-2 rounded-md bg-green-500/10 p-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-green-500" />
                          <p className="text-sm text-green-700 dark:text-green-300">{item.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Actionable Insights</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recommendations Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>
                Prioritized improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {actionableInsights.map((insight, i) => (
                    <div key={i} className="rounded-md border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{insight.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={cn(
                              insight.impact === 'High' ? "bg-red-500" :
                              insight.impact === 'Medium' ? "bg-amber-500" :
                              "bg-blue-500"
                            )}
                          >
                            {insight.impact} Impact
                          </Badge>
                          <Badge variant="outline">
                            {insight.effort} Effort
                          </Badge>
                        </div>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex items-start gap-2 rounded-md bg-primary/10 p-2">
                        <Lightbulb className="mt-0.5 h-4 w-4 text-primary" />
                        <p className="text-sm">{insight.suggestion}</p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button size="sm">
                          Apply Fix
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Knowledge Gaps */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Gaps</CardTitle>
              <CardDescription>
                Commonly missed questions and topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-3 py-2 text-xs font-medium">
                    <div className="col-span-7">Query</div>
                    <div className="col-span-3 text-center">Frequency</div>
                    <div className="col-span-2 text-right">Trend</div>
                  </div>
                  <ScrollArea className="h-[200px]">
                    {knowledgeGaps.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 border-b px-3 py-2 text-sm last:border-0">
                        <div className="col-span-7 font-medium">{item.query}</div>
                        <div className="col-span-3 text-center">{item.frequency}</div>
                        <div className="col-span-2 flex justify-end">
                          {renderKnowledgeTrend(item.trend)}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Add these topics to your knowledge base to improve response quality
                  </p>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add to Knowledge Base
                  </Button>
                </div>
                
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Knowledge gaps are identified by analyzing unanswered or poorly answered questions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Need help improving your AI quality?</h3>
              <p className="text-sm text-muted-foreground">
                Our AI optimization experts can help you analyze and enhance your agent performance
              </p>
            </div>
          </div>
          <Button className="flex items-center gap-1">
            <span>Schedule Consultation</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}