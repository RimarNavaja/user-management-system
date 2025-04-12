import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

// array in local storage for accounts
const accountsKey = 'angular-18-signup-verification-boilerplate-accounts';
let accounts = localStorage.getItem(accountsKey) ? JSON.parse(localStorage.getItem(accountsKey)!) : [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    const handleRoute = () => {
      try {
        switch (true) {
          case url.endsWith('/accounts/authenticate') && method === 'POST':
            return authenticate();
          case url.endsWith('/accounts/refresh-token') && method === 'POST':
            return refreshToken();
          case url.endsWith('/accounts/revoke-token') && method === 'POST':
            return revokeToken();
          case url.endsWith('/accounts/register') && method === 'POST':
            return register();
          case url.endsWith('/accounts/verify-email') && method === 'POST':
            return verifyEmail();
          case url.endsWith('/accounts/forgot-password') && method === 'POST':
            return forgotPassword();
          case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
            return validateResetToken();
          case url.endsWith('/accounts/reset-password') && method === 'POST':
            return resetPassword();
          case url.endsWith('/accounts') && method === 'GET':
            return getAccounts();
          case url.match(/\/accounts\/\d+$/) && method === 'GET':
            return getAccountById();
          case url.endsWith('/accounts') && method === 'POST':
            return createAccount();
          case url.match(/\/accounts\/\d+$/) && method === 'PUT':
            return updateAccount();
          case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
            return deleteAccount();
          default:
            // pass through any requests not handled above
            return next.handle(request);
        }
      } catch (err) {
        return error('An unexpected error occurred');
      }
    };

    const register = () => {
      const account = body;

      if (accounts.find(x => x.email === account.email)) {
        setTimeout(() => {
          this.alertService.info(
            `<h4>Email Already Registered</h4>
            <p>Your email ${account.email} is already registered.</p>
            <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
            <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>`,
            { autoClose: false }
          );
        }, 1000);

        return ok();
      }

      account.id = newAccountId();
      account.role = account.id === 1 ? Role.Admin : Role.User;
      account.dateCreated = new Date().toISOString();
      account.verificationToken = new Date().getTime().toString();
      account.isVerified = false;
      account.refreshTokens = [];
      delete account.confirmPassword;
      accounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      setTimeout(() => {
        const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
        this.alertService.info(`
          <h4>Verification Email</h4>
          <p>Thanks for registering!</p>
          <p>Please click the below link to verify your email address:</p>
          <a href="${verifyUrl}">${verifyUrl}</a>
          <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
        `, { autoclose: false });
      }, 1000);

      return ok();
    };

    const forgotPassword = () => {
      const { email } = body;
      const account = accounts.find(x => x.email === email);

      if (!account) return ok();

      account.resetToken = new Date().getTime().toString();
      account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
      setTimeout(() => {
        this.alertService.info(`
          <div>
            <h4>Reset Password Email</h4>
            <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</p>
          </div>
        `, 10000);
      });

      return ok();
    };

    return handleRoute().pipe(
      materialize(),
      delay(500),
      dematerialize()
    );

    function authenticate() {
      const { email, password } = body;
      
      if (!email || !password) {
        return error('Email and password are required');
      }

      const account = accounts.find(x => x.email === email);

      if (!account) return error('Email or password is incorrect');
      if (!account.isVerified) return error('Account not verified');
      if (account.password !== password) return error('Email or password is incorrect');

      // Remove expired refresh tokens
      account.refreshTokens = account.refreshTokens.filter(token => {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        return Date.now() < tokenData.exp * 1000;
      });

      const refreshToken = generateRefreshToken();
      account.refreshTokens.push(refreshToken);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok({
        ...basicDetails(account),
        jwtToken: generateJwtToken(account),
        refreshToken
      });
    }

    function refreshToken() {
      const refreshToken = getRefreshToken();

      if (!refreshToken) return unauthorized();

      const tokenData = JSON.parse(atob(refreshToken.split('.')[1]));
      if (Date.now() > tokenData.exp * 1000) return unauthorized();

      const account = accounts.find(x => x.refreshTokens.includes(refreshToken));

      if (!account) return unauthorized();

      // replace old refresh token with a new one and save
      account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
      account.refreshTokens.push(generateRefreshToken());
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok({
        ...basicDetails(account),
        jwtToken: generateJwtToken(account)
      });
    }

    function revokeToken() {
      if (!isAuthenticated()) return unauthorized();

      const refreshToken = getRefreshToken();
      const account = accounts.find(x => x.refreshTokens.includes(refreshToken));

      // revoke token and save
      account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok();
    }

    function verifyEmail() {
      const { token } = body;
      const account = accounts.find(x => x.verificationToken && x.verificationToken === token);

      if (!account) return error('Verification failed');

      account.isVerified = true;
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok();
    }

    function validateResetToken() {
      const { token } = body;
      const account = accounts.find(x =>
        x.resetToken && x.resetToken === token &&
        new Date() < new Date(x.resetTokenExpires)
      );

      if (!account) return error('Invalid token');

      return ok();
    }

    function resetPassword() {
      const { token, password } = body;
      const account = accounts.find(x =>
        !!x.resetToken && x.resetToken === token &&
        new Date() < new Date(x.resetTokenExpires)
      );

      if (!account) return error('Invalid token');

      account.password = password;
      account.isVerified = true;
      delete account.resetToken;
      delete account.resetTokenExpires;
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok();
    }

    function getAccounts() {
      if (!isAuthenticated()) return unauthorized();
      return ok(accounts.map(x => basicDetails(x)));
    }

    function getAccountById() {
      if (!isAuthenticated()) return unauthorized();

      let account = accounts.find(x => x.id === idFromUrl());

      if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
        return unauthorized();
      }

      return ok(basicDetails(account));
    }

    function createAccount() {
      if (!isAuthorized(Role.Admin)) return unauthorized();

      const account = body;
      if (accounts.find(x => x.email === account.email)) {
        return error(`Email ${account.email} is already registered`);
      }

      account.id = newAccountId();
      account.dateCreated = new Date().toISOString();
      account.isVerified = true;
      account.refreshTokens = [];
      delete account.confirmPassword;
      accounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok();
    }

    function updateAccount() {
      if (!isAuthenticated()) return unauthorized();

      let params = body;
      let account = accounts.find(x => x.id === idFromUrl());

      if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
        return unauthorized();
      }

      if (!params.password) {
        delete params.password;
      }

      delete params.confirmPassword;

      Object.assign(account, params);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok(basicDetails(account));
    }

    function deleteAccount() {
      if (!isAuthenticated()) return unauthorized();

      let account = accounts.find(x => x.id === idFromUrl());

      if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
        return unauthorized();
      }

      accounts = accounts.filter(x => x.id !== idFromUrl());
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok();
    }

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message?) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorized' } });
    }

    function basicDetails(account) {
      const { id, title, firstName, lastName, email, role, dateCreated, isVerified } = account;
      return { id, title, firstName, lastName, email, role, dateCreated, isVerified };
    }

    function isAuthenticated() {
      const account = currentAccount();
      return !!account;
    }

    function isAuthorized(role) {
      const account = currentAccount();
      if (!account) return false;
      return account.role === role;
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function newAccountId() {
      return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
    }

    function currentAccount() {
      try {
        const authHeader = headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return null;

        const token = authHeader.split(' ')[1];
        const tokenData = JSON.parse(atob(token.split('.')[1]));

        if (Date.now() > tokenData.exp * 1000) return null;

        const account = accounts.find(x => x.id === tokenData.id);
        return account || null;
      } catch {
        return null;
      }
    }

    function generateJwtToken(account) {
      const tokenPayload = {
        exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
        iat: Math.round(Date.now() / 1000),
        id: account.id,
        role: account.role
      };
      return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
    }

    function generateRefreshToken() {
      const tokenPayload = {
        exp: Math.round(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime() / 1000),
        iat: Math.round(Date.now() / 1000)
      };
      return `fake-refresh-token.${btoa(JSON.stringify(tokenPayload))}`;
    }

    function getRefreshToken() {
      return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
    }
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
