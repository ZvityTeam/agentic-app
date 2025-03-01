import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  FileText, 
  Zap, 
  UserRound
} from 'lucide-react';

// Response style options
const responseStyles = [
  {
    id: 'concise',
    name: 'Concise',
    description: 'Brief, to-the-point responses',
    icon: <Zap className="h-5 w-5" />,
    example: "Here's the information you need: our return policy allows returns within 30 days with receipt."
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'Comprehensive, thorough responses',
    icon: <FileText className="h-5 w-5" />,
    example: "Our return policy allows you to return any item within 30 days of purchase. You'll need your original receipt or order confirmation. Returns can be made in-store or by mail. For mail returns, please include the return form from your package. Store credit or refunds are processed within 5-7 business days."
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable responses',
    icon: <MessageSquare className="h-5 w-5" />,
    example: "Hi there! Thanks for asking about our return policy. You can return your items within 30 days, and we'll be happy to help you with that process. Just make sure you have your receipt handy, and we'll take care of the rest!"
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal, business-like responses',
    icon: <UserRound className="h-5 w-5" />,
    example: "Thank you for your inquiry regarding our return policy. We accept returns within 30 days of purchase with valid proof of purchase. Please ensure all items are in their original condition with tags attached. Our customer service team is available to assist with any further questions."
  },
];

export function ResponseConfiguration({ form }: { form: UseFormReturn<any> }) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  const name = watch('name');
  const avatar = watch('avatar');
  const responseStyle = watch('responseStyle') || 'friendly';
  const fallbackMessage = watch('fallbackMessage');
  const humanHandoff = watch('humanHandoff') || {
    enabled: false,
    threshold: 70,
    message: '',
  };
  
  const handleResponseStyleSelect = (styleId: string) => {
    setValue('responseStyle', styleId);
  };
  
  const toggleHumanHandoff = (checked: boolean) => {
    setValue('humanHandoff.enabled', checked);
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="space-y-6 md:col-span-3">
        <div className="space-y-3">
          <Label>
            Response Style <span className="text-destructive">*</span>
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {responseStyles.map((style) => (
              <motion.div
                key={style.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    responseStyle === style.id ? "border-primary bg-primary/5" : ""
                  )}
                  onClick={() => handleResponseStyleSelect(style.id)}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className={cn(
                        "rounded-full p-1.5",
                        responseStyle === style.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {style.icon}
                      </div>
                      <h3 className="font-semibold">{style.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <span className={cn("text-xs text-destructive", errors.responseStyle ? "block" : "hidden")}>
            {errors.responseStyle?.message as string || "Please select a response style"}
          </span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fallbackMessage">
            Fallback Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="fallbackMessage"
            placeholder="Message to show when your agent doesn't know the answer..."
            className={cn("min-h-[80px] resize-y", errors.fallbackMessage && "border-destructive")}
            {...register('fallbackMessage')}
          />
          <span className={cn("text-xs text-destructive", errors.fallbackMessage ? "block" : "hidden")}>
            {errors.fallbackMessage?.message as string || "This field is required"}
          </span>
        </div>
        
        <div className="space-y-4 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="humanHandoffEnabled" className="text-base">Human Handoff</Label>
              <p className="text-sm text-muted-foreground">
                Allow conversations to be transferred to human agents
              </p>
            </div>
            <Switch
              id="humanHandoffEnabled"
              checked={humanHandoff.enabled}
              onCheckedChange={toggleHumanHandoff}
            />
          </div>
          
          {humanHandoff.enabled && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="humanHandoffThreshold">Confidence Threshold</Label>
                  <span className="text-sm font-medium">{humanHandoff.threshold}%</span>
                </div>
                <Slider
                  id="humanHandoffThreshold"
                  min={0}
                  max={100}
                  step={5}
                  value={[humanHandoff.threshold]}
                  onValueChange={(value) => setValue('humanHandoff.threshold', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Transfer to a human when AI confidence falls below this threshold
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="humanHandoffMessage">Handoff Message</Label>
                <Input
                  id="humanHandoffMessage"
                  placeholder="Message to show when transferring to a human..."
                  {...register('humanHandoff.message')}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be shown when transferring to a human agent
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="md:col-span-2">
        <div className="sticky top-6 space-y-4">
          <h3 className="font-medium text-muted-foreground">Preview</h3>
          
          <Card className="overflow-hidden">
            <div className="bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={avatar} alt="Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{name || "Your Agent"}</h3>
                  <p className="text-xs text-muted-foreground">
                    {responseStyle ? getResponseStyleName(responseStyle) : "Select a style"}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Example Response:</h4>
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p>{getResponseExample(responseStyle)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Fallback Response:</h4>
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p>{fallbackMessage || "I'm sorry, I don't have enough information to answer that question."}</p>
                </div>
              </div>
              
              {humanHandoff.enabled && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Human Handoff:</h4>
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <p>
                      {humanHandoff.message || "I'll connect you with a human agent who can better assist you."}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
                      <span>Transferring to human agent...</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">Tips:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Choose a response style that matches your brand voice</li>
              <li>Create a helpful fallback message for when your agent doesn't know the answer</li>
              <li>Enable human handoff for complex queries that AI can't handle</li>
              <li>Set an appropriate confidence threshold based on your agent's knowledge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getResponseStyleName(styleId: string) {
  const style = responseStyles.find(s => s.id === styleId);
  return style ? style.name : "Select Style";
}

function getResponseExample(styleId: string) {
  const style = responseStyles.find(s => s.id === styleId);
  return style ? style.example : "Select a response style to see an example.";
}