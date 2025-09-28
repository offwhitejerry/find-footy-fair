import { admin } from '@/config/site';

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('ADMIN_OK') === '1' && !!admin.passcodeHash;
};

export const isAdminVisible = (): boolean => {
  return admin.showAdmin && isAdminAuthenticated();
};

export const signOutAdmin = (): void => {
  localStorage.removeItem('ADMIN_OK');
  window.location.reload();
};