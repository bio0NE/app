import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Loader2, Wallet, FileCode2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Watchlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState([]);
  const [newItem, setNewItem] = useState({ address: '', type: 'wallet' });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('watchlist_items') // ✅ FIXED
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setWatchlist(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to fetch watchlist',
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [user, toast]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.address.trim()) {
      toast({
        variant: 'destructive',
        title: 'Address is required',
      });
      return;
    }
    setIsAdding(true);
    try {
      const { data, error } = await supabase
        .from('watchlist_items') // ✅ FIXED
        .insert([
          {
            user_id: user.id,
            target: newItem.address.trim(), // ✅ match your DB column
            target_type: newItem.type, // ✅ match your DB column
          },
        ])
        .select();

      if (error) throw error;

      setWatchlist([data[0], ...watchlist]);
      setNewItem({ address: '', type: 'wallet' });
      toast({
        title: 'Item added to watchlist!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add item',
        description: error.message,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteItem = async (id) => {
    const originalWatchlist = [...watchlist];
    setWatchlist(watchlist.filter((item) => item.id !== id));
    try {
      const { error } = await supabase.from('watchlist_items').delete().match({ id }); // ✅ FIXED
      if (error) throw error;
      toast({
        title: 'Item removed from watchlist',
      });
    } catch (error) {
      setWatchlist(originalWatchlist);
      toast({
        variant: 'destructive',
        title: 'Failed to remove item',
        description: error.message,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Watchlist | Solid Security</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Bell className="w-10 h-10 text-solana-teal" />
            <div>
              <h1 className="text-3xl font-bold text-white">Contract & Wallet Watchlist</h1>
              <p className="text-gray-400">Monitor addresses for suspicious activity.</p>
            </div>
          </div>
        </div>

        <Card className="mb-8 glassmorphism">
          <CardHeader>
            <CardTitle className="text-white">Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAddItem}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Input
                placeholder="Enter Wallet or Contract Address"
                value={newItem.address}
                onChange={(e) => setNewItem({ ...newItem, address: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white flex-grow"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, type: 'wallet' })}
                  variant={newItem.type === 'wallet' ? 'default' : 'outline'}
                  className={
                    newItem.type === 'wallet'
                      ? 'bg-solana-purple'
                      : 'border-gray-600 text-gray-300'
                  }
                >
                  <Wallet className="w-4 h-4 mr-2" /> Wallet
                </Button>
                <Button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, type: 'contract' })}
                  variant={newItem.type === 'contract' ? 'default' : 'outline'}
                  className={
                    newItem.type === 'contract'
                      ? 'bg-solana-purple'
                      : 'border-gray-600 text-gray-300'
                  }
                >
                  <FileCode2 className="w-4 h-4 mr-2" /> Contract
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isAdding}
                className="w-full sm:w-auto bg-solana-teal hover:bg-solana-teal/90 text-black font-bold"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="ml-2">Add</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-solana-purple animate-spin" />
          </div>
        ) : watchlist.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            Your watchlist is empty. Add an address to start monitoring.
          </p>
        ) : (
          <div className="space-y-4">
            {watchlist.map((item) => (
              <Card
                key={item.id}
                className="glassmorphism-light flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  {item.target_type === 'wallet' ? (
                    <Wallet className="w-6 h-6 text-solana-purple" />
                  ) : (
                    <FileCode2 className="w-6 h-6 text-solana-teal" />
                  )}
                  <p className="font-mono text-sm text-gray-300 truncate">
                    {item.target}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-400" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Watchlist;
