import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  Search,
  Grid3x3,
  List,
  MessageSquare,
  Calendar,
  CreditCard,
  Users,
  Mail,
  Smartphone,
  Briefcase,
  ShoppingCart,
  Headphones,
  FileText,
  Zap,
  Plus,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  Upload,
  Settings,
  Key,
  Webhook,
  Bell,
  Code,
  RefreshCw,
  Sparkles,
  Filter,
  ArrowRight,
  Loader2
} from 'lucide-react';

// Integration category types
type IntegrationCategory = 'all' | 'communication' | 'calendar' | 'crm' | 'payments';

// Integration status types
type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';

// Integration interface
interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory | IntegrationCategory[];
  icon: React.ReactNode;
  status: IntegrationStatus;
  featured?: boolean;
  stats?: {
    title: string;
    value: string;
    change?: number;
  }[];
}

export function IntegrationsHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [betaEnabled, setBetaEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('sk_test_51NzUBXXXXXXXXXXXXXXXXXXX');
  const [webhookUrl, setWebhookUrl] = useState('https://example.com/webhook');
  const [events, setEvents] = useState({
    'message.created': true,
    'message.updated': false,
    'conversation.started': true,
    'conversation.ended': false,
    'user.created': true,
  });

  // Mock integrations data
  const integrations: Integration[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Connect your WhatsApp Business account to engage with customers directly.',
      category: 'communication',
      icon: <Smartphone className="h-6 w-6" />,
      status: 'connected',
      featured: true,
      stats: [
        { title: 'Active Conversations', value: '128', change: 12 },
        { title: 'Messages Sent', value: '1,432', change: 8 },
        { title: 'Response Rate', value: '94%', change: 3 },
      ]
    },
    {
      id: 'email',
      name: 'Email Integration',
      description: 'Send automated emails and notifications through your email provider.',
      category: 'communication',
      icon: <Mail className="h-6 w-6" />,
      status: 'connected',
      featured: true,
      stats: [
        { title: 'Emails Sent', value: '856', change: 5 },
        { title: 'Open Rate', value: '42%', change: -2 },
        { title: 'Click Rate', value: '18%', change: 4 },
      ]
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Schedule appointments and meetings directly from conversations.',
      category: 'calendar',
      icon: <Calendar className="h-6 w-6" />,
      status: 'connected',
      featured: true,
      stats: [
        { title: 'Appointments', value: '42', change: 15 },
        { title: 'Booking Rate', value: '68%', change: 7 },
        { title: 'No-shows', value: '5%', change: -3 },
      ]
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Process payments and subscriptions securely within conversations.',
      category: 'payments',
      icon: <CreditCard className="h-6 w-6" />,
      status: 'connected',
      featured: true,
      stats: [
        { title: 'Transactions', value: '86', change: 23 },
        { title: 'Revenue', value: '$4,280', change: 18 },
        { title: 'Avg. Order', value: '$49.76', change: -2 },
      ]
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Sync customer data and conversations with your Salesforce CRM.',
      category: 'crm',
      icon: <Briefcase className="h-6 w-6" />,
      status: 'disconnected',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Connect your HubSpot CRM to track leads and customer interactions.',
      category: 'crm',
      icon: <Users className="h-6 w-6" />,
      status: 'disconnected',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and manage conversations through Slack channels.',
      category: 'communication',
      icon: <MessageSquare className="h-6 w-6" />,
      status: 'disconnected',
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Integrate with your Shopify store to handle orders and product inquiries.',
      category: 'payments',
      icon: <ShoppingCart className="h-6 w-6" />,
      status: 'error',
    },
    {
      id: 'zendesk',
      name: 'Zendesk',
      description: 'Create and manage support tickets from AI conversations.',
      category: 'crm',
      icon: <Headphones className="h-6 w-6" />,
      status: 'disconnected',
    },
    {
      id: 'microsoft-calendar',
      name: 'Microsoft Calendar',
      description: 'Schedule meetings and appointments with Microsoft Calendar.',
      category: 'calendar',
      icon: <Calendar className="h-6 w-6" />,
      status: 'disconnected',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Process payments through PayPal directly in conversations.',
      category: 'payments',
      icon: <CreditCard className="h-6 w-6" />,
      status: 'disconnected',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Connect your Telegram bot to engage with users on the platform.',
      category: 'communication',
      icon: <MessageSquare className="h-6 w-6" />,
      status: 'disconnected',
    },
  ];

  // Filter integrations based on search query and selected category
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (Array.isArray(integration.category) 
                             ? integration.category.includes(selectedCategory)
                             : integration.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Featured integrations
  const featuredIntegrations = integrations.filter(integration => integration.featured);

  // Handle integration selection
  const handleSelectIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigOpen(true);
  };

  // Handle connect/configure button click
  const handleConnectClick = (integration: Integration, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIntegration(integration);
    setConfigOpen(true);
  };

  // Render status badge
  const renderStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  // Simulate connection process
  const handleConnect = () => {
    if (!selectedIntegration) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Close the configuration panel
      setConfigOpen(false);
      // Reset selected integration
      setSelectedIntegration(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations Hub</h1>
          <p className="text-muted-foreground">
            Connect your agents with other platforms and services
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search integrations..."
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
              className={selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="communication" 
              className={selectedCategory === 'communication' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setSelectedCategory('communication')}
            >
              Communication
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className={selectedCategory === 'calendar' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setSelectedCategory('calendar')}
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="crm" 
              className={selectedCategory === 'crm' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setSelectedCategory('crm')}
            >
              CRM
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className={selectedCategory === 'payments' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setSelectedCategory('payments')}
            >
              Payments
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
        </div>
      </div>

      {/* Featured Integrations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Integrations</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredIntegrations.map((integration) => (
            <motion.div
              key={integration.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md",
                        integration.status === 'connected' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        {renderStatusBadge(integration.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {integration.stats && (
                    <div className="grid grid-cols-3 gap-2">
                      {integration.stats.map((stat, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-xs text-muted-foreground">{stat.title}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-lg font-semibold">{stat.value}</p>
                            {stat.change !== undefined && (
                              <span className={cn(
                                "text-xs font-medium",
                                stat.change > 0 ? "text-green-500" : "text-red-500"
                              )}>
                                {stat.change > 0 ? '+' : ''}{stat.change}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    variant={integration.status === 'connected' ? 'outline' : 'default'} 
                    className="w-full"
                    onClick={(e) => handleConnectClick(integration, e)}
                  >
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations (Beta) */}
      <Card className="border-dashed bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Smart Recommendations</CardTitle>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">Beta</Badge>
            </div>
            <Switch checked={betaEnabled} onCheckedChange={setBetaEnabled} />
          </div>
          <CardDescription>
            Let AI analyze your business and recommend the best integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {betaEnabled ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-md border border-dashed p-4">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">Upload Product Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your product catalog, website, or business description
                    </p>
                    <Button size="sm" className="mt-2">Upload Files</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Input placeholder="E.g., E-commerce, SaaS, Healthcare..." />
                </div>
                
                <div className="space-y-2">
                  <Label>Key Business Goals</Label>
                  <Textarea placeholder="What are your main business objectives?" className="min-h-[100px]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Recommended Integrations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/10 p-1.5">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">Shopify</span>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500">98% Match</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/10 p-1.5">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">Mailchimp</span>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500">92% Match</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/10 p-1.5">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">Stripe</span>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500">87% Match</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Recommendation Preview</h3>
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-sm">
                      Based on your e-commerce business, we recommend integrating with Shopify for product management, Mailchimp for email marketing, and Stripe for payment processing.
                    </p>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Recommendations
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Enable Smart Recommendations</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                Our AI will analyze your business and recommend the best integrations to boost your productivity and customer engagement.
              </p>
              <Button onClick={() => setBetaEnabled(true)}>
                Enable Beta Feature
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Integrations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Integrations</h2>
        
        {filteredIntegrations.length === 0 ? (
          <Card className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <Search className="mb-2 h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium">No integrations found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredIntegrations.map((integration) => (
              <motion.div
                key={integration.id}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card 
                  className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                  onClick={() => handleSelectIntegration(integration)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-md",
                          integration.status === 'connected' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {integration.icon}
                        </div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                      </div>
                      {renderStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant={integration.status === 'connected' ? 'outline' : 'default'} 
                      size="sm"
                      className="w-full"
                      onClick={(e) => handleConnectClick(integration, e)}
                    >
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-xs font-medium">
              <div className="col-span-4">Name</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            <ScrollArea className="h-[500px]">
              {filteredIntegrations.map((integration) => (
                <div 
                  key={integration.id} 
                  className="grid cursor-pointer grid-cols-12 items-center border-b px-4 py-3 text-sm last:border-0 hover:bg-muted/50"
                  onClick={() => handleSelectIntegration(integration)}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md",
                      integration.status === 'connected' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {integration.icon}
                    </div>
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  <div className="col-span-4 line-clamp-1 text-muted-foreground">
                    {integration.description}
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="capitalize">
                      {Array.isArray(integration.category) 
                        ? integration.category[0] 
                        : integration.category}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    {renderStatusBadge(integration.status)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => handleConnectClick(integration, e)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>

      {/* API & Webhooks Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">API & Webhooks</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for direct integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="api-key" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep your API key secure. Never share it publicly.
                </p>
              </div>
              
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Usage</span>
                  </div>
                  <Badge variant="outline">
                    12,450 / 50,000
                  </Badge>
                </div>
                <Progress value={25} className="mt-2 h-1" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Generate New API Key
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Configure webhooks to receive real-time events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input 
                  id="webhook-url" 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Event Subscriptions</Label>
                <div className="space-y-2 rounded-md border p-3">
                  {Object.entries(events).map(([event, enabled]) => (
                    <div key={event} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event}</span>
                      </div>
                      <Switch 
                        checked={enabled} 
                        onCheckedChange={(checked) => 
                          setEvents(prev => ({ ...prev, [event]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                Save Webhook Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Configuration Sheet */}
      <Sheet open={configOpen} onOpenChange={setConfigOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg">
          <SheetHeader>
            {selectedIntegration && (
              <>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md",
                    selectedIntegration.status === 'connected' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {selectedIntegration.icon}
                  </div>
                  <SheetTitle>{selectedIntegration.name}</SheetTitle>
                </div>
                <SheetDescription>
                  {selectedIntegration.description}
                </SheetDescription>
              </>
            )}
          </SheetHeader>
          
          {selectedIntegration && (
            <div className="mt-6 space-y-6">
              <Tabs defaultValue="setup">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="test">Test</TabsTrigger>
                </TabsList>
                
                <TabsContent value="setup" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Connection Steps</h3>
                    <div className="rounded-md border">
                      <div className="flex items-center gap-2 border-b bg-green-500/10 p-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="font-medium">Step 1: Create an account</span>
                      </div>
                      
                      <div className="flex items-center gap-2 border-b bg-primary/5 p-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
                          2
                        </div>
                        <span className="font-medium">Step 2: Generate API credentials</span>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 text-muted-foreground">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground bg-background">
                          3
                        </div>
                        <span>Step 3: Configure settings</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" placeholder="Enter your API key" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-secret">API Secret</Label>
                    <Input id="api-secret" type="password" placeholder="Enter your API secret" />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-md bg-muted p-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Don't have an account?</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Sign Up
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://example.com/webhook" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Event Notifications</Label>
                    <div className="space-y-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message Received</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message Sent</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Status Changed</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Advanced Settings</Label>
                    <div className="space-y-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-sm font-medium">Retry Failed Requests</span>
                          <p className="text-xs text-muted-foreground">
                            Automatically retry failed API requests
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-sm font-medium">Debug Mode</span>
                          <p className="text-xs text-muted-foreground">
                            Enable detailed logging for troubleshooting
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="test" className="mt-4 space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Test Connection</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Verify that your integration is working correctly
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Run Connection Test
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Sample Data</h3>
                    <div className="mb-4 rounded-md bg-muted p-3">
                      <pre className="text-xs">
                        {`{
  "event": "message.received",
  "timestamp": "2025-03-18T14:22:33Z",
  "data": {
    "message_id": "msg_123456",
    "content": "Hello, I need help with my order",
    "user_id": "user_789012"
  }
}`}
                      </pre>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Send Test Webhook
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Documentation</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      View detailed integration documentation
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      View Documentation
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setConfigOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnect} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}