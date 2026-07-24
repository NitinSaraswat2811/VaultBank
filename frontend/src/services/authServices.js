import api from './apiClient';

export const loginUser = (formData) => api.post('/auth/login', formData);
export const registerUser = (formData) => api.post('/auth/register', formData);
export const CreateBankAccount = (formData) => api.post('/accounts',formData);
export const transferMoney = (formData) => api.post('/transactions',formData);
export const getAllUserAccounts = ()=> api.get('/accounts');
export const getbalance = (accountId)=> api.get(`/accounts/balance/${accountId}`);
export const getTransactionHistory = (accountId)=> api.get(`/transactions/TransactionHistory/${accountId}`);