import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Check, 
  X, 
  Upload, 
  Sparkles,
  Bot,
  MessageSquare,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BasicSetupStep } from './wizard-steps/basic-setup-step';
import { IndustryUseCase } from './wizard-steps/industry-use-case-step';
import { KnowledgePersonality } from './wizard-steps/knowledge-personality-step';
import { ResponseConfiguration } from './wizard-steps/response-configuration-step';
import { TestDeploy } from './wizard-steps/test-deploy-step';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/redux';
import { createAgent } from '@/store/slices/agents-slice';

// Define the schema for the form
const agentFormSchema = z.object({
  // Step 1: Basic Setup
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  avatar: z.string().optional(),
  purpose: z.enum(["sales", "support", "leads", "other"]),
  
  // Step 2: Industry & Use Case
  industry: z.string(),
  useCase: z.string(),
  whatWeDo: z.string().min(10).max(1000),
  whatWeDontDo: z.string().max(1000).optional(),
  
  // Step 3: Knowledge & Personality
  files: z.array(z.any()).optional(),
  personalityTone: z.number().min(0).max(100),
  dataCollection: z.object({
    collectName: z.boolean().default(false),
    collectEmail: z.boolean().default(false),
    collectPhone: z.boolean().default(false),
    collectCompany: z.boolean().default(false),
  }),
  knowledgeBase: z.string().max(5000).optional(),
  
  // Step 4: Response Configuration
  responseStyle: z.enum(["concise", "detailed", "friendly", "professional"]),
  fallbackMessage: z.string().min(5).max(200),
  humanHandoff: z.object({
    enabled: z.boolean().default(false),
    threshold: z.number().min(0).max(100).default(70),
    message: z.string().max(200).optional(),
  }),
  
  // Step 5: Test & Deploy
  isActive: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  allowFeedback: z.boolean().default(true),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

const defaultValues: Partial<AgentFormValues> = {
  name: '',
  description: '',
  purpose: 'support',
  industry: '',
  useCase: '',
  whatWeDo: '',
  whatWeDontDo: '',
  files: [],
  personalityTone: 50,
  dataCollection: {
    collectName: true,
    collectEmail: true,
    collectPhone: false,
    collectCompany: false,
  },
  knowledgeBase: '',
  responseStyle: 'friendly',
  fallbackMessage: "I'm sorry, I don't have enough information to answer that question. Would you like to speak with a human agent?",
  humanHandoff: {
    enabled: true,
    threshold: 70,
    message: "I'll connect you with a human agent who can better assist you.",
  },
  isActive: false,
  isPublic: false,
  allowFeedback: true,
};

interface CreateAgentWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAgentWizard({ isOpen, onClose }: CreateAgentWizardProps) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
    mode: 'onChange',
  });
  
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;
  
  const handleNext = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    
    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    } else {
      // Show error toast
      toast.error("Please fix the errors before proceeding");
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };
  
  const onSubmit = async (data: AgentFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert form data to agent format
      const agentData = {
        name: data.name,
        description: data.description,
        model: "GPT-4", // Default model
        systemPrompt: generateSystemPrompt(data),
        temperature: data.personalityTone / 100, // Convert to 0-1 range
        maxTokens: 1000, // Default
        userId: "user1", // Current user ID
      };
      
      // Dispatch create agent action
      await dispatch(createAgent(agentData));
      
      toast.success("Agent created successfully!");
      // onClose(); add this onclose based on requirement
    } catch (error) {
      toast.error("Failed to create agent");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to generate system prompt from form data
  const generateSystemPrompt = (data: AgentFormValues) => {
    return `You are a ${data.responseStyle} AI assistant for ${data.purpose} purposes in the ${data.industry} industry.
    
What you do:
${data.whatWeDo}

What you don't do:
${data.whatWeDontDo || "N/A"}

Knowledge base:
${data.knowledgeBase || "No specific knowledge base provided."}`;
  };
  
  // Helper function to get fields for validation based on current step
  const getFieldsForStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return ['name', 'description', 'purpose'];
      case 2:
        return ['industry', 'useCase', 'whatWeDo'];
      case 3:
        return ['personalityTone', 'dataCollection'];
      case 4:
        return ['responseStyle', 'fallbackMessage', 'humanHandoff'];
      case 5:
        return [];
      default:
        return [];
    }
  };
  
  // Step titles
  const stepTitles = [
    "Basic Setup",
    "Industry & Use Case",
    "Knowledge & Personality",
    "Response Configuration",
    "Test & Deploy"
  ];
  
  // Step icons
  const stepIcons = [
    <Bot key={1} className="h-5 w-5" />,
    <Sparkles key={2} className="h-5 w-5" />,
    <Upload key={3} className="h-5 w-5" />,
    <MessageSquare key={4} className="h-5 w-5" />,
    <Rocket key={5} className="h-5 w-5" />
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto p-0 md:p-0">
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="sticky top-0 z-10 bg-background px-6 pt-6">
            <div className="mb-2 flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {step === totalSteps ? "Launch Your Agent" : "Create New Agent"}
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
            
            {/* Progress bar and steps */}
            <div className="mb-6 space-y-3">
              <Progress value={progress} className="h-2" />
              
              <div className="flex justify-between px-1">
                {stepTitles.map((title, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-md p-1 text-xs font-medium transition-colors",
                      step === index + 1 
                        ? "text-primary" 
                        : step > index + 1 
                          ? "text-muted-foreground" 
                          : "text-muted-foreground/50"
                    )}
                    onClick={() => {
                      // Only allow going back to previous steps or current step
                      if (index + 1 <= step) {
                        setStep(index + 1);
                      }
                    }}
                    whileHover={{ scale: index + 1 <= step ? 1.05 : 1 }}
                    whileTap={{ scale: index + 1 <= step ? 0.95 : 1 }}
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                      step === index + 1 
                        ? "border-primary bg-primary/10" 
                        : step > index + 1 
                          ? "border-primary/50 bg-primary/5" 
                          : "border-muted-foreground/30 bg-background"
                    )}>
                      {step > index + 1 ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        stepIcons[index]
                      )}
                    </div>
                    <span className="max-w-[80px] text-center">{title}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </DialogHeader>
          
          <div className="px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && <BasicSetupStep form={form} />}
                {step === 2 && <IndustryUseCase form={form} />}
                {step === 3 && <KnowledgePersonality form={form} />}
                {step === 4 && <ResponseConfiguration form={form} />}
                {step === 5 && <TestDeploy form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <DialogFooter className="sticky bottom-0 z-10 flex w-full items-center justify-between gap-2 border-t bg-background/80 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting}
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>
            </div>
            
            <div>
              {step < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Launching...</>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Launch Agent
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}