
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    const PagePlaceholder = ({ icon: Icon, title, description, isComingSoon = false, actionButton }) => {
      const { toast } = useToast();

      const handleNotImplemented = () => {
        toast({
          variant: "destructive",
          title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
      };
      
      const buttonToShow = actionButton ? (
        <Button onClick={handleNotImplemented} className="bg-solana-purple hover:bg-solana-purple/90 font-bold py-3 px-8 rounded-full shadow-lg shadow-solana-purple/30">
          {actionButton}
        </Button>
      ) : (
        isComingSoon && (
          <div className="bg-solana-purple text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-solana-purple/30">
            COMING SOON
          </div>
        )
      );

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center h-[calc(100vh-10rem)] p-8 glassmorphism rounded-2xl"
        >
          <div className="relative mb-6">
            <div className="absolute -inset-2 bg-gradient-to-r from-solana-purple to-solana-teal rounded-full blur-xl opacity-30"></div>
            <div className="relative w-24 h-24 flex items-center justify-center bg-gray-900/80 rounded-full border border-white/10">
              <Icon className="w-12 h-12 text-solana-teal" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="max-w-xl text-gray-400 mb-8">{description}</p>
          {buttonToShow}
        </motion.div>
      );
    };

    export default PagePlaceholder;
  