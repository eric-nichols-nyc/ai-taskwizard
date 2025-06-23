import { useEffect, useState } from 'react';
import { Button } from '@turbo-with-tailwind-v4/ui/button';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Header() {
  // Simulate fetching user (replace with real auth logic)
  const [user, setUser] = useState<unknown>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate async user fetch
    setTimeout(() => {
      // setUser({ name: 'Test User' }); // Uncomment to simulate logged in
      setUser(null); // Simulate not logged in
    }, 100);
  }, []);

  return (
    <motion.header
      className="flex items-center justify-between p-6 relative z-10 bg-white/10 backdrop-blur-md shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-2">
        <a href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">TaskWizard AI</span>
        </a>
      </div>

      <nav className="flex items-center space-x-8">
        <Button
          asChild
          className="relative px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-pink-400/40 border-2 border-white/20"
        >
          <a href="/engineering-deep-dive" className="flex items-center space-x-2">
            <span>🚀</span>
            <span>Engineering Deep Dive</span>
          </a>
        </Button>
        {user ? (
          <Button onClick={() => router.navigate({ to: '/dashboard' })} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full">Dashboard</Button>
        ) : (
          <Button
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
            onClick={() => router.navigate({ to: '/login' })}
          >
            Sign Up Now
          </Button>
        )}
      </nav>
    </motion.header>
  );
} 