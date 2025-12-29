
    import React from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { BookOpen, ShieldQuestion, Wallet, Bot } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    const educationTopics = [
        {
            icon: ShieldQuestion,
            title: "What are Wallet Drainers?",
            description: "Malicious smart contracts that trick you into signing a transaction that gives them permission to transfer your assets out of your wallet.",
        },
        {
            icon: Wallet,
            title: "Understanding Token Approvals",
            description: "When you use a DApp, you often approve it to spend your tokens. Old, unused approvals can be a security risk. Regularly review and revoke them.",
        },
        {
            icon: Bot,
            title: "Spotting Phishing Scams",
            description: "Scammers create fake websites or send DMs that look legitimate to steal your private keys or seed phrase. Always double-check URLs and never share your secrets.",
        },
         {
            icon: ShieldQuestion,
            title: "The Danger of Airdrop Scams",
            description: "Beware of unsolicited tokens appearing in your wallet. Interacting with them can sometimes trigger malicious contracts. If it seems too good to be true, it probably is.",
        },
    ];

    const Education = () => {
      return (
        <>
          <Helmet>
            <title>Education Center | Solid Security</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4 mb-8">
                <BookOpen className="w-10 h-10 text-solana-teal" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Security Education Center</h1>
                    <p className="text-gray-400">Stay ahead of scammers by learning about common threats.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educationTopics.map((topic, index) => (
                    <motion.div
                        key={topic.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="h-full glassmorphism-light hover:border-solana-purple/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <topic.icon className="w-8 h-8 text-solana-purple" />
                                <CardTitle className="text-white text-lg">{topic.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">{topic.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
          </motion.div>
        </>
      );
    };

    export default Education;
  