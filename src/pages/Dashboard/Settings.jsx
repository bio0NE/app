
    import React, { useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Settings as SettingsIcon, User, Mail, Wallet, LogOut, Sun, Moon, Bell } from 'lucide-react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useWallet } from '@solana/wallet-adapter-react';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';

    const Settings = () => {
      const { user, signOut } = useAuth();
      const { wallet, disconnect, connected } = useWallet();
      const { toast } = useToast();
      const [email, setEmail] = useState(user?.email || '');

      const handleUpdateEmail = (e) => {
        e.preventDefault();
        toast({
          title: "🚧 Feature Not Implemented",
          description: "Updating email is not available yet. You can request this in a future prompt!",
        });
      };

      const handleThemeToggle = () => {
         toast({
          title: "🚧 Feature Not Implemented",
          description: "Theme switching is coming soon!",
        });
      }

      return (
        <>
          <Helmet>
            <title>Settings | Solid Security</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 solana-glow-teal">
                    <SettingsIcon className="w-8 h-8 text-solana-green" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400">Manage your account and preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><User /> Account</CardTitle>
                        <CardDescription>Manage your account details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {user?.email && (
                            <form onSubmit={handleUpdateEmail} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-gray-900/70 border-gray-700 text-white focus:solana-glow-purple"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-solana-purple hover:bg-solana-purple/90 font-bold">Update Email</Button>
                            </form>
                        )}
                        <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2"><Wallet className="w-4 h-4" /> Connected Wallet</Label>
                            {connected && wallet ? (
                                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                                    <p className="text-sm font-mono text-white truncate">{wallet.adapter.name}</p>
                                    <Button variant="destructive" size="sm" onClick={disconnect}>Disconnect</Button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 p-3 bg-gray-900/50 rounded-lg">No wallet connected.</p>
                            )}
                        </div>
                        <Button onClick={signOut} variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                            <LogOut className="w-4 h-4 mr-2" /> Log Out
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-white">Preferences</CardTitle>
                        <CardDescription>Customize your experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <Label htmlFor="theme" className="text-gray-300 flex items-center gap-2"><Sun className="w-4 h-4" /> / <Moon className="w-4 h-4" /> Theme</Label>
                            <Switch id="theme" onCheckedChange={handleThemeToggle} />
                        </div>
                         <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <Label htmlFor="notifications" className="text-gray-300 flex items-center gap-2"><Bell className="w-4 h-4" /> Push Notifications</Label>
                            <Switch id="notifications" onCheckedChange={() => toast({ title: "🚧 Feature Not Implemented" })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
          </motion.div>
        </>
      );
    };

    export default Settings;
  