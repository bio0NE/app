
    import React, { useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { MessageSquare, Send, Link, FileText, Loader2, ExternalLink } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/supabaseClient';

    const Support = () => {
      const { user } = useAuth();
      const { toast } = useToast();
      const [link, setLink] = useState('');
      const [description, setDescription] = useState('');
      const [isLoading, setIsLoading] = useState(false);

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!link.trim()) {
          toast({ variant: 'destructive', title: 'Scam link is required.' });
          return;
        }
        setIsLoading(true);

        try {
          const { error } = await supabase.from('scam_reports').insert({
            user_id: user?.id,
            link,
            description,
            status: 'submitted',
          });

          if (error) throw error;

          toast({
            title: 'Report Submitted!',
            description: 'Thank you for helping keep the community safe.',
          });
          setLink('');
          setDescription('');

        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: 'Could not submit your report. Please try again.',
          });
          console.error("Error submitting scam report:", error);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <>
          <Helmet>
            <title>Support | Solid Security</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
             <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 solana-glow-teal">
                    <MessageSquare className="w-8 h-8 text-solana-green" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Support & Report</h1>
                    <p className="text-gray-400">Report suspicious links or get help from our team.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-white">Report a Scam</CardTitle>
                        <CardDescription>Found a phishing link or a rug pull? Let us know.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-gray-300 flex items-center gap-2"><Link className="w-4 h-4"/> Suspicious URL</label>
                                <Input 
                                    placeholder="https://malicious-site.com/..."
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="bg-gray-900/70 border-gray-700 text-white focus:solana-glow-purple"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-300 flex items-center gap-2"><FileText className="w-4 h-4"/> Description (Optional)</label>
                                <Textarea 
                                    placeholder="Describe why you think this is a scam..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-gray-900/70 border-gray-700 text-white focus:solana-glow-purple"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full bg-solana-purple hover:bg-solana-purple/90 font-bold solana-glow-purple">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 mr-2"/>}
                                Submit Report
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                 <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-white">Get Support</CardTitle>
                        <CardDescription>Need help? Join our community channels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <a
                        href="https://x.com/SOLSEC_OFC"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-between border-gray-600 hover:bg-gray-800 hover:text-white"
                        >
                          <span>Follow us on X (Twitter)</span>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </CardContent>
                </Card>
            </div>
          </motion.div>
        </>
      );
    };

    export default Support;
  