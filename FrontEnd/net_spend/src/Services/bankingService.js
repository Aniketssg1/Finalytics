// bankingService.js — Refactored to use Axios via centralized API config
import { accountApi } from '../config/api';

const bankingService = {
  async createAccount(accountData) {
    const response = await accountApi.post('/accounts', accountData);
    return response.data;
  },

  async updateAccountInfo(accountId, accountInfo) {
    const response = await accountApi.put(`/accounts/${accountId}`, accountInfo);
    return response.data;
  },

  async getAccountSummary(accountId) {
    const response = await accountApi.get(`/accounts/transactions/${accountId}`);
    return response.data;
  },

  async deleteAccount(accountId) {
    const response = await accountApi.delete(`/accounts/${accountId}`);
    return response.data;
  },

  async transferFunds(transferDetails) {
    const response = await accountApi.post('/accounts/transfers', transferDetails);
    return response.data;
  },

  async fetchTransactions(accountId) {
    const response = await accountApi.get(`/accounts/transactions/${accountId}`);
    return response.data;
  },

  async getAllAccounts() {
    const response = await accountApi.get('/accounts');
    return response.data;
  },

  async getBalance(accountId) {
    const response = await accountApi.get(`/accounts/balance/${accountId}`);
    return response.data;
  },
};

export default bankingService;
