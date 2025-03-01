import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAgents } from '@/store/slices/agents-slice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/format-date';
import { CreateAgentButton } from '@/components/agents/create-agent-button';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  MoreVertical,
  Bot,
  MessageSquare,
  Clock,
  ThumbsUp,
  Zap,
  Edit,
  Copy,
  Trash,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Settings as SettingsIcon,
  RefreshCw,
  Plus
} from 'lucide-react';

export function Agents() {
  const dispatch = useAppDispatch();
  const { agents, isLoading, error } = useAppSelector((state) => state.agents);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'training' | 'offline' | 'draft'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'support' | 'sales' | 'leads' | 'other'>('all');

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  // Simulated agent statuses
  const getAgentStatus = (index: number) => {
    const statuses = ['active', 'training', 'offline', 'draft'];
    return statuses[index % statuses.length];
  };

  // Simulated agent types
  const getAgentType = (index: number) => {
    const types = ['support', 'sales', 'leads', 'other'];
    return types[index % types.length];
  };

  // Filter agents based on search query, status, and type
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || getAgentStatus(parseInt(agent.id)) === selectedStatus;
    const matchesType = selectedType === 'all' || getAgentType(parseInt(agent.id)) === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderAgentStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'training':
        return <Badge className="bg-amber-500">Training</Badge>;
      case 'offline':
        return <Badge variant="outline">Offline</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const renderAgentType = (type: string) => {
    switch (type) {
      case 'support':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Support</Badge>;
      case 'sales':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Sales</Badge>;
      case 'leads':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500">Leads</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  // Loading state
  if (isLoading && agents.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading agents...</p>
      </div>
    );
  }

  // Error state
  if (error && agents.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
        <p className="mb-4 text-center text-muted-foreground">
          We couldn't load your agents. Please try again.
        </p>
        <Button onClick={() => dispatch(fetchAgents())}>
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
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents
          </p>
        </div>
        <CreateAgentButton />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs>
            <TabsList className="h-9">
              <TabsTrigger 
                value="all" 
                className={selectedStatus === 'all' ? 'bg-primary text-primary-foreground' : ''}
                onClick={() => setSelectedStatus('all')}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                className={selectedStatus === 'active' ? 'bg-primary text-primary-foreground' : ''}
                onClick={() => setSelectedStatus('active')}
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                value="training" 
                className={selectedStatus === 'training' ? 'bg-primary text-primary-foreground' : ''}
                onClick={() => setSelectedStatus('training')}
              >
                Training
              </TabsTrigger>
              <TabsTrigger 
                value="offline" 
                className={selectedStatus === 'offline' ? 'bg-primary text-primary-foreground' : ''}
                onClick={() => setSelectedStatus('offline')}
              >
                Offline
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-none rounded-l-md",
                viewMode === 'grid' && "bg-muted"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-none rounded-r-md",
                viewMode === 'list' && "bg-muted"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Type</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedType('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedType('support')}>
                Support
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('sales')}>
                Sales
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('leads')}>
                Lead Generation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('other')}>
                Other
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Empty state */}
      {filteredAgents.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            {searchQuery || selectedStatus !== 'all' || selectedType !== 'all' ? (
              <>
                <h3 className="mb-2 text-xl font-semibold">No matching agents</h3>
                <p className="mb-6 max-w-md text-center text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedType('all');
                }}>
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <h3 className="mb-2 text-xl font-semibold">No agents yet</h3>
                <p className="mb-6 max-w-md text-center text-muted-foreground">
                  Create your first AI agent to start automating tasks and enhancing your workflow
                </p>
                <CreateAgentButton />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agent cards */}
      {filteredAgents.length > 0 && (
        viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                          <AvatarImage src={agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`} alt={agent.name} />
                          <AvatarFallback>
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <CardTitle className="text-base">{agent.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            {renderAgentStatus(getAgentStatus(parseInt(agent.id)))}
                            {renderAgentType(getAgentType(parseInt(agent.id)))}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit agent
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {agent.description}
                    </p>
                    
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Conversations</p>
                          <p className="text-lg font-semibold">{Math.floor(Math.random() * 100)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Satisfaction</p>
                          <p className="text-lg font-semibold">{Math.floor(80 + Math.random() * 20)}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Response Time</p>
                          <p className="text-lg font-semibold">{(1 + Math.random() * 2).toFixed(1)}s</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Last Active</p>
                          <p className="text-lg font-semibold">{formatRelativeTime(new Date(Date.now() - Math.random() * 86400000 * 5))}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-muted-foreground">Usage</span>
                          <span className="font-medium">
                            {Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 100)} className="h-1" />
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
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-xs font-medium">
              <div className="col-span-4">Agent</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Conversations</div>
              <div className="col-span-2">Last Active</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            <ScrollArea className="h-[500px]">
              {filteredAgents.map((agent) => (
                <div 
                  key={agent.id} 
                  className="grid grid-cols-12 items-center border-b px-4 py-3 text-sm last:border-0 hover:bg-muted/50"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-primary/10">
                      <AvatarImage src={agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`} alt={agent.name} />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{agent.description}</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    {renderAgentStatus(getAgentStatus(parseInt(agent.id)))}
                    {renderAgentType(getAgentType(parseInt(agent.id)))}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-muted-foreground">
                    {formatRelativeTime(new Date(Date.now() - Math.random() * 86400000 * 5))}
                  </div>
                  <div className="col-span-1 flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link to={`/agents/${agent.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/agents/${agent.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )
      )}

      {/* Quick Actions */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">
                Manage your agents and settings
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Sync Agents
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <SettingsIcon className="h-4 w-4" />
              Agent Settings
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}