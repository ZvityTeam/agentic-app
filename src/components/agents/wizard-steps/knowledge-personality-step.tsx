import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  File, 
  X, 
  FileText,
  Bot
} from 'lucide-react';

export function KnowledgePersonality({ form }: { form: UseFormReturn<any> }) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  const name = watch('name');
  const avatar = watch('avatar');
  const files = watch('files') || [];
  const personalityTone = watch('personalityTone') || 50;
  const dataCollection = watch('dataCollection') || {
    collectName: false,
    collectEmail: false,
    collectPhone: false,
    collectCompany: false,
  };
  const knowledgeBase = watch('knowledgeBase');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Combine with existing files
    setValue('files', [...files, ...acceptedFiles]);
  }, [files, setValue]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxSize: 10485760, // 10MB
  });
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setValue('files', newFiles);
  };
  
  const getPersonalityDescription = (value: number) => {
    if (value < 25) return "Formal and precise";
    if (value < 50) return "Professional and helpful";
    if (value < 75) return "Friendly and conversational";
    return "Casual and enthusiastic";
  };
  
  const getPersonalityExample = (value: number) => {
    if (value < 25) {
      return "I've analyzed your request and can provide the following information. According to our records, the return policy allows for returns within 30 days of purchase with a valid receipt.";
    } else if (value < 50) {
      return "Thank you for your question. Our return policy allows you to return items within 30 days of purchase. You'll need your receipt for the return process. Is there anything else I can help you with?";
    } else if (value < 75) {
      return "Hi there! Thanks for asking about our return policy. You can return your items within 30 days, and we'll be happy to help you with that process. Just make sure you have your receipt handy!";
    } else {
      return "Hey! 😊 No worries about returns at all! You've got a full 30 days to bring items back, just bring your receipt and we'll sort it out super quick! Anything else you're wondering about?";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="space-y-6 md:col-span-3">
        <div className="space-y-3">
          <Label>
            Upload Knowledge Files <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <div 
            {...getRootProps()} 
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <h3 className="font-medium">Drag & drop files here</h3>
              <p className="text-sm text-muted-foreground">
                or click to browse (max 10MB per file)
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, TXT, CSV, JSON
              </p>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files</Label>
              <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-md border p-2">
                {files.map((file: File, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between rounded-md bg-muted p-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="rounded-full p-1 hover:bg-background"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="personalityTone">Personality Tone</Label>
            <span className="text-sm font-medium">
              {getPersonalityDescription(personalityTone)}
            </span>
          </div>
          <Slider
            id="personalityTone"
            min={0}
            max={100}
            step={1}
            value={[personalityTone]}
            onValueChange={(value) => setValue('personalityTone', value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Formal</span>
            <span>Professional</span>
            <span>Friendly</span>
            <span>Casual</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Data Collection</Label>
          <div className="space-y-2 rounded-md border p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Select what information your agent should collect from users
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="collectName" 
                  checked={dataCollection.collectName}
                  onCheckedChange={(checked) => 
                    setValue('dataCollection.collectName', checked)
                  }
                />
                <Label htmlFor="collectName" className="text-sm font-normal">
                  Name
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="collectEmail" 
                  checked={dataCollection.collectEmail}
                  onCheckedChange={(checked) => 
                    setValue('dataCollection.collectEmail', checked)
                  }
                />
                <Label htmlFor="collectEmail" className="text-sm font-normal">
                  Email Address
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="collectPhone" 
                  checked={dataCollection.collectPhone}
                  onCheckedChange={(checked) => 
                    setValue('dataCollection.collectPhone', checked)
                  }
                />
                <Label htmlFor="collectPhone" className="text-sm font-normal">
                  Phone Number
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="collectCompany" 
                  checked={dataCollection.collectCompany}
                  onCheckedChange={(checked) => 
                    setValue('dataCollection.collectCompany', checked)
                  }
                />
                <Label htmlFor="collectCompany" className="text-sm font-normal">
                  Company Name
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="knowledgeBase">
            Knowledge Base <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="knowledgeBase"
            placeholder="Add specific knowledge, facts, or information your agent should know..."
            className="min-h-[150px] resize-y"
            {...register('knowledgeBase')}
          />
          <p className="text-xs text-muted-foreground">
            This information will be used to train your agent on specific knowledge
          </p>
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
                    {getPersonalityDescription(personalityTone)}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="space-y-4 p-4">
              <div>
                <h4 className="text-sm font-medium">Example Response:</h4>
                <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                  <p>{getPersonalityExample(personalityTone)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Data Collection:</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dataCollection.collectName && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Name
                    </span>
                  )}
                  {dataCollection.collectEmail && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Email
                    </span>
                  )}
                  {dataCollection.collectPhone && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Phone
                    </span>
                  )}
                  {dataCollection.collectCompany && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Company
                    </span>
                  )}
                  {!dataCollection.collectName && !dataCollection.collectEmail && 
                   !dataCollection.collectPhone && !dataCollection.collectCompany && (
                    <span className="text-sm text-muted-foreground">No data collection enabled</span>
                  )}
                </div>
              </div>
              
              {files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Knowledge Files:</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {files.length} file{files.length !== 1 ? 's' : ''} uploaded
                    </span>
                  </div>
                </div>
              )}
              
              {knowledgeBase && (
                <div>
                  <h4 className="text-sm font-medium">Custom Knowledge:</h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                    {knowledgeBase}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">Tips:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Upload relevant documents to improve your agent's knowledge</li>
              <li>Adjust the personality tone to match your brand voice</li>
              <li>Only collect the information you actually need from users</li>
              <li>Add specific knowledge that your agent should always know</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}