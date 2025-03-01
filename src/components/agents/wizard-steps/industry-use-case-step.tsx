import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  Briefcase, 
  Plane, 
  Home, 
  ShoppingCart,
  Landmark,
  Utensils
} from 'lucide-react';

// Industry options
const industryOptions = [
  { id: 'retail', name: 'Retail', icon: <ShoppingBag className="h-6 w-6" /> },
  { id: 'technology', name: 'Technology', icon: <Building2 className="h-6 w-6" /> },
  { id: 'education', name: 'Education', icon: <GraduationCap className="h-6 w-6" /> },
  { id: 'healthcare', name: 'Healthcare', icon: <Stethoscope className="h-6 w-6" /> },
  { id: 'finance', name: 'Finance', icon: <Landmark className="h-6 w-6" /> },
  { id: 'travel', name: 'Travel', icon: <Plane className="h-6 w-6" /> },
  { id: 'realestate', name: 'Real Estate', icon: <Home className="h-6 w-6" /> },
  { id: 'ecommerce', name: 'E-Commerce', icon: <ShoppingCart className="h-6 w-6" /> },
  { id: 'professional', name: 'Professional Services', icon: <Briefcase className="h-6 w-6" /> },
  { id: 'hospitality', name: 'Hospitality', icon: <Utensils className="h-6 w-6" /> },
];

// Use case templates
const useCaseTemplates = [
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Answer common questions, troubleshoot issues, and guide users through processes.',
    whatWeDo: 'I help customers by answering frequently asked questions, troubleshooting common issues, and guiding them through processes like returns, account setup, and product usage. I can provide step-by-step instructions and link to relevant resources.',
    whatWeDontDo: 'I don\'t process payments, access customer accounts without proper authentication, or handle sensitive personal information beyond what\'s necessary for support.'
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Recommend products, answer product questions, and guide purchase decisions.',
    whatWeDo: 'I help potential customers find the right products based on their needs, answer questions about features and specifications, compare options, and guide them through the purchase process. I can provide pricing information and availability.',
    whatWeDontDo: 'I don\'t process payments, apply discounts without authorization, or make promises about delivery times that can\'t be guaranteed.'
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    description: 'Collect visitor information, qualify leads, and schedule appointments.',
    whatWeDo: 'I engage with website visitors, answer initial questions about products/services, collect contact information from interested prospects, qualify leads based on predefined criteria, and help schedule appointments or demos with sales representatives.',
    whatWeDontDo: 'I don\'t make final sales, negotiate pricing, or share confidential information about other customers or internal business operations.'
  },
  {
    id: 'onboarding',
    name: 'User Onboarding',
    description: 'Guide new users through setup, answer questions, and provide tutorials.',
    whatWeDo: 'I help new users get started with the product/service by guiding them through the initial setup process, explaining key features, answering questions, and providing tutorials or resources for further learning.',
    whatWeDontDo: 'I don\'t modify account settings without explicit permission, access user data unnecessarily, or provide technical support beyond my knowledge base.'
  },
];

export function IndustryUseCase({ form }: { form: UseFormReturn<any> }) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  const name = watch('name');
  const avatar = watch('avatar');
  const industry = watch('industry');
  const useCase = watch('useCase');
  const whatWeDo = watch('whatWeDo');
  const whatWeDontDo = watch('whatWeDontDo');
  
  const handleIndustrySelect = (industryId: string) => {
    setValue('industry', industryId);
  };
  
  const handleUseCaseSelect = (template: any) => {
    setValue('useCase', template.id);
    setValue('whatWeDo', template.whatWeDo);
    setValue('whatWeDontDo', template.whatWeDontDo);
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="space-y-6 md:col-span-3">
        <div className="space-y-3">
          <Label>
            Industry <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {industryOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-md border p-3 text-center transition-all hover:border-primary",
                    industry === option.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onClick={() => handleIndustrySelect(option.id)}
                >
                  <div className={cn(
                    "rounded-full p-2",
                    industry === option.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {option.icon}
                  </div>
                  <span className="text-xs font-medium">{option.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <span className={cn("text-xs text-destructive", errors.industry ? "block" : "hidden")}>
            {errors.industry?.message as string || "Please select an industry"}
          </span>
        </div>
        
        <div className="space-y-3">
          <Label>
            Use Case Template <span className="text-destructive">*</span>
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {useCaseTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    useCase === template.id ? "border-primary bg-primary/5" : ""
                  )}
                  onClick={() => handleUseCaseSelect(template)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <span className={cn("text-xs text-destructive", errors.useCase ? "block" : "hidden")}>
            {errors.useCase?.message as string || "Please select a use case"}
          </span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatWeDo">
            What We Do <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="whatWeDo"
            placeholder="Describe what your agent can do for users..."
            className={cn("min-h-[120px] resize-y", errors.whatWeDo && "border-destructive")}
            {...register('whatWeDo')}
          />
          <span className={cn("text-xs text-destructive", errors.whatWeDo ? "block" : "hidden")}>
            {errors.whatWeDo?.message as string || "This field is required"}
          </span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatWeDontDo">
            What We Don't Do <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="whatWeDontDo"
            placeholder="Describe any limitations or boundaries for your agent..."
            className="min-h-[100px] resize-y"
            {...register('whatWeDontDo')}
          />
          <span className="text-xs text-muted-foreground">
            Setting clear boundaries helps manage user expectations
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
                  <AvatarImage src={avatar} alt="Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{name || "Your Agent"}</h3>
                  <p className="text-xs text-muted-foreground">
                    {getIndustryName(industry)} • {getUseCaseName(useCase)}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="space-y-4 p-4">
              <div>
                <h4 className="text-sm font-medium">What I can do:</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {whatWeDo || "Describe what your agent can do for users..."}
                </p>
              </div>
              
              {whatWeDontDo && (
                <div>
                  <h4 className="text-sm font-medium">What I can't do:</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {whatWeDontDo}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium">Ready to assist</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">Tips:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Choose the industry that best matches your business</li>
              <li>Select a use case template as a starting point</li>
              <li>Be specific about what your agent can and cannot do</li>
              <li>Setting clear boundaries helps manage user expectations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getIndustryName(industryId: string) {
  const industry = industryOptions.find(i => i.id === industryId);
  return industry ? industry.name : "Select Industry";
}

function getUseCaseName(useCaseId: string) {
  const useCase = useCaseTemplates.find(u => u.id === useCaseId);
  return useCase ? useCase.name : "Select Use Case";
}