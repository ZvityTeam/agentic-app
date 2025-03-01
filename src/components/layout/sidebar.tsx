import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { toggleSidebar } from '@/store/slices/ui-slice';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  MessagesSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Agents',
      href: '/agents',
      icon: <Bot className="h-5 w-5" />,
    },
    {
      name: 'Conversations',
      href: '/conversations',
      icon: <MessagesSquare className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'Integrations',
      href: '/integrations',
      icon: <Plug className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col border-r bg-gradient-to-b from-card to-card/80 transition-all duration-300 ease-in-out',
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          {sidebarOpen ? (
            <span className="text-xl font-bold text-primary">AgentHub</span>
          ) : (
            <span className="text-xl font-bold text-primary">A</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-8 z-10 hidden h-8 w-8 rounded-full border bg-background shadow-md md:flex"
          onClick={() => dispatch(toggleSidebar())}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
              (location.pathname === item.href || 
               (item.href === '/agents' && location.pathname.startsWith('/agents/'))) 
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <span
              className={cn(
                'transition-transform duration-200',
                (location.pathname === item.href || 
                 (item.href === '/agents' && location.pathname.startsWith('/agents/')))
                  ? 'scale-110'
                  : 'group-hover:scale-110'
              )}
            >
              {item.icon}
            </span>
            {sidebarOpen && (
              <span
                className={cn(
                  'transition-opacity',
                  sidebarOpen ? 'opacity-100' : 'opacity-0'
                )}
              >
                {item.name}
              </span>
            )}
            {(location.pathname === item.href || 
              (item.href === '/agents' && location.pathname.startsWith('/agents/'))) && (
              <span className="absolute left-0 h-full w-1 rounded-r-full bg-primary" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}