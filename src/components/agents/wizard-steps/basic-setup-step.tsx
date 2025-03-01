import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, MessageSquare, ShoppingCart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Avatar options
const avatarOptions = [
  { id: 'avatar1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix' },
  { id: 'avatar2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bella' },
  { id: 'avatar3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zoe' },
  { id: 'avatar4', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Coco' },
  { id: 'avatar5', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Milo' },
  { id: 'avatar6', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Oliver' },
];

export function BasicSetupStep({ form }: { form: UseFormReturn<any> }) {
  const { register, watch, setValue, formState: { errors } } = form;
  const [charCount, setCharCount] = useState(0);
  
  const name = watch('name');
  const description = watch('description');
  const purpose = watch('purpose');
  const avatar = watch('avatar');
  
  useEffect(() => {
    setCharCount(description?.length || 0);
  }, [description]);
  
  useEffect(() => {
    // Set default avatar if none selected
    if (!avatar && avatarOptions.length > 0) {
      setValue('avatar', avatarOptions[0].url);
    }
  }, [avatar, setValue]);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="space-y-6 md:col-span-3">
        <div className="space-y-2">
          <Label htmlFor="name">
            Agent Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="E.g., Support Assistant, Sales Bot..."
            {...register('name')}
            className={cn(errors.name && "border-destructive")}
          />
          <div className="flex justify-between text-xs">
            <span className={cn("text-destructive", errors.name ? "opacity-100" : "opacity-0")}>
              {errors.name?.message as string || "Error"}
            </span>
            <span className="text-muted-foreground">{name?.length || 0}/50</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe what your agent does and how it can help users..."
            className={cn("min-h-[120px] resize-y", errors.description && "border-destructive")}
            {...register('description')}
          />
          <div className="flex justify-between text-xs">
            <span className={cn("text-destructive", errors.description ? "opacity-100" : "opacity-0")}>
              {errors.description?.message as string || "Error"}
            </span>
            <span className={cn(
              "text-muted-foreground",
              charCount > 450 ? "text-amber-500" : "",
              charCount > 500 ? "text-destructive" : ""
            )}>
              {charCount}/500
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>
            Avatar <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {avatarOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-1 rounded-md border p-2 transition-all hover:border-primary",
                    avatar === option.url ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onClick={() => setValue('avatar', option.url)}
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={option.url} alt="Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="purpose">
            Purpose <span className="text-destructive">*</span>
          </Label>
          <Select
            defaultValue={purpose}
            onValueChange={(value) => setValue('purpose', value)}
          >
            <SelectTrigger className={cn(errors.purpose && "border-destructive")}>
              <SelectValue placeholder="Select a purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Sales</span>
                </div>
              </SelectItem>
              <SelectItem value="support">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </div>
              </SelectItem>
              <SelectItem value="leads">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Lead Generation</span>
                </div>
              </SelectItem>
              <SelectItem value="other">
                <div className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  <span>Other</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <span className={cn("text-xs text-destructive", errors.purpose ? "opacity-100" : "opacity-0")}>
            {errors.purpose?.message as string || "Error"}
          </span>
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
                  <AvatarImage src={avatar || avatarOptions[0].url} alt="Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{name || "Your Agent Name"}</h3>
                  <p className="text-xs text-muted-foreground">
                    {getPurposeLabel(purpose)}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm">
                {description || "Your agent description will appear here. Make it clear and concise so users understand what your agent can help them with."}
              </p>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium">Online</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">Tips:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Keep the name short and descriptive</li>
              <li>Clearly explain what your agent can do</li>
              <li>Choose an avatar that matches your brand</li>
              <li>Select the purpose that best fits your use case</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get purpose label
function getPurposeLabel(purpose: string) {
  switch (purpose) {
    case 'sales':
      return 'Sales Assistant';
    case 'support':
      return 'Customer Support';
    case 'leads':
      return 'Lead Generation';
    case 'other':
      return 'Custom Assistant';
    default:
      return 'AI Assistant';
  }
}