import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Bot, 
  User, 
  Globe, 
  Lock, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export function TestDeploy({ form }: { form: UseFormReturn<any> }) {
  const { watch, setValue } = form;
  
  const name = watch('name');
  const avatar = watch('avatar');
  const responseStyle = watch('responseStyle');
  const isActive = watch('isActive') || false;
  const isPublic = watch('isPublic') || false;
  const allowFeedback = watch('allowFeedback') || true;
  
  const [testMessage, setTestMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'agent', content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  
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
        response = `Hello! I'm ${name || 'your AI assistant'}. How can I help you today?`;
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

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="space-y-6 md:col-span-3">
        <div className="rounded-md border">
          <div className="border-b bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} alt="Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span className="font-medium">{name || "Test Your Agent"}</span>
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
                        <AvatarImage src={avatar} alt="Avatar" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2",
                      message.role === 'user' 
                        ? "bg-primary text-primary-foreground" 
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
                      <AvatarImage src={avatar} alt="Avatar" />
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
                
                {conversation[conversation.length - 1]?.role === 'agent' && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Deployment Options</h3>
          
          <div className="space-y-4 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">Activate Agent</Label>
                <p className="text-sm text-muted-foreground">
                  Make this agent available for conversations
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic" className="text-base">Public Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anyone to chat with this agent
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setValue('isPublic', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowFeedback" className="text-base">Allow Feedback</Label>
                <p className="text-sm text-muted-foreground">
                  Let users rate agent responses
                </p>
              </div>
              <Switch
                id="allowFeedback"
                checked={allowFeedback}
                onCheckedChange={(checked) => setValue('allowFeedback', checked)}
              />
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="settings">
              <AccordionTrigger>Review Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 rounded-md bg-muted p-4 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium">Name:</p>
                      <p className="text-muted-foreground">{name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Response Style:</p>
                      <p className="text-muted-foreground">{responseStyle || "Not set"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Status:</p>
                      <p className="text-muted-foreground">{isActive ? "Active" : "Inactive"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Access:</p>
                      <p className="text-muted-foreground">{isPublic ? "Public" : "Private"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Feedback:</p>
                      <p className="text-muted-foreground">{allowFeedback ? "Enabled" : "Disabled"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Human Handoff:</p>
                      <p className="text-muted-foreground">{watch('humanHandoff.enabled') ? "Enabled" : "Disabled"}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="md:col-span-2">
        <div className="sticky top-6 space-y-4">
          <h3 className="font-medium text-muted-foreground">Deployment Preview</h3>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarImage src={avatar} alt="Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{name || "Your Agent"}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={cn(
                        "flex items-center gap-1",
                        isActive ? "text-green-500" : "text-muted-foreground"
                      )}>
                        {isActive ? (
                          <>
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></div>
                            <span>Inactive</span>
                          </>
                        )}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {isPublic ? (
                          <>
                            <Globe className="h-3 w-3" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3" />
                            <span>Private</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-md border border-dashed p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ready to Launch</p>
                      <p className="text-xs text-muted-foreground">
                        Your agent will be {isActive ? "active" : "inactive"} after launch
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Deployment Options:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Website Chat Widget</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Direct Link</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>API Integration</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    className="rounded-md bg-primary/5 p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-green-500/10 p-1">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="font-medium">Ready for Launch!</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your agent is configured and ready to be deployed.
                    </p>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">Next Steps After Launch:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Embed your agent on your website</li>
              <li>Share the direct link with your team</li>
              <li>Monitor performance in the analytics dashboard</li>
              <li>Refine your agent based on user feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}