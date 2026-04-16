import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ROUTES } from '@/config/constants';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import '@/styles/globals.css';
import styles from '../App.module.css';

import AuthGuard from '@/components/common/AuthGuard/AuthGuard';
import { useMsal } from '@azure/msal-react';

// Lazy load pages
import PromptPage from '@/pages/PromptPage';
import VideoPlayerPage from '@/pages/VideoPlayerPage';

const AuthenticatedLayout = () => {
  const { accounts } = useMsal();
  const isBypassActive = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const user = accounts[0] || (isBypassActive ? { name: 'Local Developer', username: 'dev@local' } : null);

  return (
    <AuthGuard>
      <div className={styles.app}>
        <Sidebar aria-label="Main Navigation" />
        <div className={styles.mainContent}>
          <Header
            userName={user?.name || 'User'}
            userEmail={user?.username || ''}
          />
          <div className={styles.contentArea}>
            <Outlet />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

const rootRoute = createRootRoute({
  component: Outlet
});

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthenticatedLayout
});

const indexRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTES.HOME,
  component: PromptPage
});

const playerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTES.PLAYER,
  component: VideoPlayerPage
});

const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([
    indexRoute,
    playerRoute
  ])
]);

export const router = createRouter({ routeTree });

