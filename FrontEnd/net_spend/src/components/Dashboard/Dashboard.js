import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../slices/authSlice";
import { accountApi } from "../../config/api";
import SpendAnalyzer from "./SpendAnalyzer";
import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user if not already in state
        if (!user) {
          await dispatch(fetchCurrentUser());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch, user]);

  // Fetch account data when user is available
  useEffect(() => {
    async function fetchAccountData() {
      if (!user?.accountNumber) return;
      try {
        const [txResp, balResp] = await Promise.all([
          accountApi.get(`/accounts/transactions/${user.accountNumber}`).catch(() => ({ data: [] })),
          accountApi.get(`/accounts/balance/${user.accountNumber}`).catch(() => ({ data: 0 })),
        ]);
        setTransactions(Array.isArray(txResp.data) ? txResp.data : []);
        setBalance(balResp.data || 0);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    }
    fetchAccountData();
  }, [user]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      FOOD: '🍔', TRANSPORT: '🚗', SHOPPING: '🛍️', ENTERTAINMENT: '🎬',
      UTILITIES: '💡', HEALTHCARE: '🏥', EDUCATION: '📚', RENT: '🏠',
      SALARY: '💰', OTHER: '📦',
    };
    return icons[category] || '📦';
  };

  // Calculate stats
  const totalExpenses = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const recentTransactions = transactions.slice(0, 8);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const displayName = user?.firstName?.trim()
    ? `${user.firstName} ${user.lastName || ''}`
    : 'User';

  return (
    <div className="dashboard-page">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <h1>{getTimeBasedGreeting()}, {displayName}! 👋</h1>
        <p>Here's your financial overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card slide-up" style={{ animationDelay: '0s' }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Total Balance</span>
            <div className="stat-card-icon balance">💰</div>
          </div>
          <div className="stat-card-value">{formatCurrency(balance)}</div>
          <span className="stat-card-change positive">Account #{user?.accountNumber}</span>
        </div>

        <div className="stat-card slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Total Expenses</span>
            <div className="stat-card-icon expense">📉</div>
          </div>
          <div className="stat-card-value">{formatCurrency(totalExpenses)}</div>
          <span className="stat-card-change negative">{transactions.length} transactions</span>
        </div>

        <div className="stat-card slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Transactions</span>
            <div className="stat-card-icon transfers">📊</div>
          </div>
          <div className="stat-card-value">{transactions.length}</div>
          <span className="stat-card-change positive">This period</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Spend Analyzer */}
        <div className="chart-card">
          <h2>Spending Analysis</h2>
          <SpendAnalyzer transactions={transactions} />
        </div>

        {/* Recent Transactions */}
        <div className="transactions-card">
          <h2>Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx, index) => (
              <div className="transaction-item" key={tx.transactionId || index}>
                <div className="transaction-info">
                  <div className="transaction-icon">
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-name">
                      {tx.category || 'Transaction'}
                    </div>
                    <div className="transaction-date">
                      {tx.transactionDate
                        ? new Date(tx.transactionDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="transaction-amount debit">
                  -{formatCurrency(tx.amount)}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
              No transactions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
