import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/Auth/AuthModal';
import { Navbar } from './components/Layout/Navbar';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { ProductList } from './components/Products/ProductList';
import { CustomerList } from './components/Customers/CustomerList';
import { SaleList } from './components/Sales/SaleList';
import './index.css';

const MainContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="full-screen-loader">
        <div className="spinner-lg"></div>
        <p>Connecting to Sales App API...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-main">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'products' && <ProductList />}
        {activeTab === 'customers' && <CustomerList />}
        {activeTab === 'sales' && <SaleList />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
