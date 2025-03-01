import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAgents } from '@/store/slices/agents-slice';
import { dashboardApi } from '@/api/dashboard-api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Zap,
  Users,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Bot,
  BarChart,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatRelativeTime } from '@/utils/format-date';
import { cn } from '@/lib/utils';
import { CreateAgentButton } from '@/components/agents/create-agent-button';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { agents, isLoading: agentsLoading, error: agentsError } = useAppSelector((state) => state.agents);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [timeMessage, setTimeMessage] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getDashboardData();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
      setTimeMessage('Start your day with a new agent');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
      setTimeMessage('Boost your productivity this afternoon');
    } else {
      setGreeting('Good evening');
      setTimeMessage('Wrap up your day with insights');
    }
  }, []);

  // Loading state
  if ((isLoading && !dashboardData) || (agentsLoading && agents.length === 0)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if ((error || agentsError) && agents.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
        <p className="mb-4 text-center text-muted-foreground">
          We couldn't load your dashboard data. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Get the appropriate analytics data based on selected timeframe
  const getAnalyticsData = () => {
    if (!dashboardData) return null;
    
    switch (selectedTimeframe) {
      case 'day':
        return dashboardData.analyticsData.day;
      case 'week':
        return dashboardData.analyticsData.week;
      case 'month':
        return dashboardData.analyticsData.month;
      default:
        return dashboardData.analyticsData.week;
    }
  };

  const analyticsData = getAnalyticsData();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="mt-1 text-muted-foreground">{timeMessage}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {dashboardData?.quickStats.map((stat, i) => (
              <Card key={i} className="flex w-full flex-1 min-w-[140px] border shadow-sm md:min-w-[160px]">
                <CardContent className="flex flex-row items-center justify-between p-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={cn(
                      "flex items-center text-xs font-medium",
                      stat.change > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {stat.change > 0 ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(stat.change)}%
                    </div>
                    <div className="rounded-full bg-primary/10 p-1.5">
                      {i === 0 ? <Bot className="h-4 w-4" /> : 
                       i === 1 ? <MessageSquare className="h-4 w-4" /> :
                       i === 2 ? <Users className="h-4 w-4" /> :
                       <Clock className="h-4 w-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <Collapsible
        open={analyticsOpen}
        onOpenChange={setAnalyticsOpen}
        className="rounded-lg border bg-card shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Analytics Overview</h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {analyticsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="space-y-4 px-6 pb-6">
            <Tabs defaultValue={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  View detailed reports
                </Button>
              </div>
              
              {analyticsData && (
                <>
                  <TabsContent value="day" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.conversations}</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.conversations > 0 ? '+' : ''}{analyticsData.change.conversations}% from yesterday
                          </p>
                          <div className="mt-2">
                            <Progress value={65} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.satisfaction}%</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.satisfaction > 0 ? '+' : ''}{analyticsData.change.satisfaction}% from yesterday
                          </p>
                          <div className="mt-2">
                            <Progress value={analyticsData.satisfaction} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.responseRate}%</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.responseRate > 0 ? '+' : ''}{analyticsData.change.responseRate}% from yesterday
                          </p>
                          <div className="mt-2">
                            <Progress value={analyticsData.responseRate} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.responseTime}</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.responseTime < 0 ? '' : '+'}{analyticsData.change.responseTime}s from yesterday
                          </p>
                          <div className="mt-2">
                            <Progress value={85} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="week" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.conversations}</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.conversations > 0 ? '+' : ''}{analyticsData.change.conversations}% from last week
                          </p>
                          <div className="mt-2">
                            <Progress value={72} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.satisfaction}%</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.satisfaction > 0 ? '+' : ''}{analyticsData.change.satisfaction}% from last week
                          </p>
                          <div className="mt-2">
                            <Progress value={analyticsData.satisfaction} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.responseRate}%</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.responseRate > 0 ? '+' : ''}{analyticsData.change.responseRate}% from last week
                          </p>
                          <div className="mt-2">
                            <Progress value={analyticsData.responseRate} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.responseTime}</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.responseTime < 0 ? '' : '+'}{analyticsData.change.responseTime}s from last week
                          </p>
                          <div className="mt-2">
                            <Progress value={80} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="month" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.conversations}</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.conversations > 0 ? '+' : ''}{analyticsData.change.conversations}% from last month
                          </p>
                          <div className="mt-2">
                            <Progress value={78} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.satisfaction}%</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.satisfaction > 0 ? '+' : ''}{analyticsData.change.satisfaction}% from last month
                          </p>
                          <div className="mt-2">
                            <Progress value={analyticsData.satisfaction} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.responseRate}%</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.responseRate > 0 ? '+' : ''}{analyticsData.change.responseRate}% from last month
                          </p>
                          <div className="mt-2">
                            <Progress value={analyticsData.responseRate} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analyticsData.responseTime}</div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.change.responseTime < 0 ? '' : '+'}{analyticsData.change.responseTime}s from last month
                          </p>
                          <div className="mt-2">
                            <Progress value={75} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Create New Agent CTA */}
      <Card className="overflow-hidden border-dashed bg-gradient-to-br from-card to-card/50 shadow-md transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Create a New AI Agent</h2>
              <p className="text-muted-foreground">
                Build, train, and deploy custom AI agents for your specific needs
              </p>
            </div>
            <CreateAgentButton />
          </div>
        </CardContent>
      </Card>

      {/* Your Agents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Agents</h2>
          <CreateAgentButton />
        </div>

        {/* Empty state */}
        {agents.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No agents yet</h3>
              <p className="mb-6 max-w-md text-center text-muted-foreground">
                Create your first AI agent to start automating tasks and enhancing your workflow
              </p>
              <CreateAgentButton />
            </CardContent>
          </Card>
        )}

        {/* Agent cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className="group overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {agent.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.status && (
                      <Badge className={
                        agent.status === 'active' ? "bg-green-500" :
                        agent.status === 'training' ? "bg-amber-500" :
                        agent.status === 'offline' ? "border border-muted-foreground/30 bg-transparent text-muted-foreground" :
                        "bg-secondary text-secondary-foreground"
                      }>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit agent</DropdownMenuItem>
                        <DropdownMenuItem>View analytics</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Conversations</p>
                      <p className="text-lg font-semibold">{agent.stats?.conversations || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Satisfaction</p>
                      <p className="text-lg font-semibold">{agent.stats?.satisfaction || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Response Time</p>
                      <p className="text-lg font-semibold">{agent.stats?.responseTime || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Last Active</p>
                      <p className="text-lg font-semibold">
                        {agent.stats?.lastActive ? formatRelativeTime(agent.stats.lastActive) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">Usage</span>
                      <span className="font-medium">
                        {agent.stats?.usage || 0}%
                      </span>
                    </div>
                    <Progress value={agent.stats?.usage || 0} className="h-1" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex w-full items-center justify-between">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                    <Link to={`/agents/${agent.id}`}>View Details</Link>
                  </Button>
                  <Button size="sm" className="h-8 px-2 text-xs">
                    <Zap className="mr-1 h-3 w-3" />
                    Chat Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}