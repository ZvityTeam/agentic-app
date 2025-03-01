import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleSidebar } from '@/store/slices/ui-slice';
import { logout } from '@/store/slices/auth-slice';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  User,
  LogOut,
  Search,
  Bell,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Header() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
        <div className="flex flex-1 items-center justify-between">
          <Link to="/" className="flex items-center md:hidden">
            <span className="text-xl font-bold text-primary">AgentHub</span>
          </Link>

          <div
            className={cn(
              'mx-4 flex items-center transition-all duration-200 ease-in-out',
              searchExpanded ? 'w-full md:w-96' : 'w-9 md:w-64'
            )}
          >
            <div className="relative w-full">
              <Search
                className={cn(
                  'absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-all',
                  searchExpanded ? 'opacity-100' : 'opacity-70'
                )}
              />
              <Input
                type="search"
                placeholder="Search..."
                className={cn(
                  'w-full bg-muted pl-8 transition-all duration-200',
                  searchExpanded
                    ? 'border-primary pr-4'
                    : 'border-transparent md:pr-4',
                  'focus-visible:border-primary'
                )}
                onFocus={() => setSearchExpanded(true)}
                onBlur={() => setSearchExpanded(false)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  <Badge
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]"
                    variant="destructive"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                    <div className="flex w-full justify-between">
                      <span className="font-medium">New agent created</span>
                      <span className="text-xs text-muted-foreground">
                        2m ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your agent "Customer Support" has been created successfully
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                    <div className="flex w-full justify-between">
                      <span className="font-medium">System update</span>
                      <span className="text-xs text-muted-foreground">
                        1h ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      New features have been added to the platform
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                    <div className="flex w-full justify-between">
                      <span className="font-medium">Usage limit</span>
                      <span className="text-xs text-muted-foreground">
                        5h ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You've reached 80% of your monthly usage limit
                    </p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center text-center font-medium text-primary">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex w-full cursor-pointer items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="flex w-full cursor-pointer items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/help"
                      className="flex w-full cursor-pointer items-center"
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}