import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/redux';
import { BaseLayout } from '@/layouts/base-layout';
import { Dashboard } from '@/pages/dashboard';
import { Home } from '@/pages/home';
import { Login } from '@/pages/login';
import { NotFound } from '@/pages/not-found';
import { Profile } from '@/pages/profile';
import { Register } from '@/pages/register';
import { AgentDashboard } from '@/pages/agent-dashboard';
import { Agents } from '@/pages/agents';
import { Conversations } from '@/pages/conversations';
import { IntegrationsHub } from '@/pages/integrations-hub';
import { AnalyticsDashboard } from '@/pages/analytics-dashboard';
import { Settings } from '@/pages/settings';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { checkAuth } from '@/store/slices/auth-slice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="agents" element={<Agents />} />
          <Route path="agents/:id" element={<AgentDashboard />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="integrations" element={<IntegrationsHub />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;