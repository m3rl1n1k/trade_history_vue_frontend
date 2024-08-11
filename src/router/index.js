import {createRouter, createWebHistory} from 'vue-router';
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue"; // Імпортуйте відсутні компоненти
import TransactionsView from "@/views/Transaction/TransactionsView.vue"; // Імпортуйте відсутні компоненти
import ProfileView from "@/views/ProfileView.vue"; // Імпортуйте відсутні компоненти
import {isTokenValid} from './auth';
import TransactionNewView from "@/views/Transaction/TransactionNewView.vue";
import WalletNewView from "@/views/Wallet/WalletNewView.vue";
import WalletsView from "@/views/Wallet/WalletsView.vue";
import SettingView from "@/views/SettingView.vue";
import IndexView from "@/views/IndexView.vue";

const routes = [
    {
        path: "/",
        component: IndexView,
        name: 'index'
    },
    {
        path: "/login",
        component: LoginView,
        name: 'login'
    },
    {
        path: "/registration",
        component: RegisterView,
        name: 'registration'
    },
    {
        path: "/dashboard",
        component: DashboardView,
        name: 'dashboard',
        meta: {
            requiresAuth: true
        }
    },
    // Transaction
    {
        path: "/transactions",
        component: TransactionsView,
        name: 'transactions',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/transactions/new",
        component: TransactionNewView,
        name: 'transaction_new',
        meta: {
            requiresAuth: true
        }
    },

    // Wallet
    {
        path: "/wallets",
        component: WalletsView,
        name: 'wallets',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/wallets/new",
        component: WalletNewView,
        name: 'wallet_new',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile",
        component: ProfileView,
        name: 'profile',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/settings",
        component: SettingView,
        name: 'settings',
        meta: {
            requiresAuth: true
        }
    }

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});


router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = isTokenValid(token);

    if (to.matched.some(record => record.meta.requiresAuth)) {
        // If the route requires authentication and the user is not authenticated, redirect to login
        if (!isAuthenticated) {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        } else {
            next();

        }
    } else {
        // If the user is authenticated and trying to access login or register, redirect to dashboard
        if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
            next({path: '/dashboard'});
        } else {
            next();
        }
    }
});
export default router;
