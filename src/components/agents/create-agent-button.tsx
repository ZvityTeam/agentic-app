import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sparkles } from 'lucide-react';
import { CreateAgentWizard } from './create-agent-wizard';
import { motion } from 'framer-motion';

export function CreateAgentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Button 
          className="group relative overflow-hidden" 
          size="lg"
          onClick={() => setIsOpen(true)}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 group-hover:animate-shimmer" />
          <Sparkles className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          Create New Agent
        </Button>
      </motion.div>
      
      <CreateAgentWizard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}