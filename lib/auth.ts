import * as Cookies from 'js-cookie';
import config from '../config';
import { gqlQuery } from '../utils/gqlQuery';
import { promiseTimeout } from '../utils/promiseTimeout';

export const getAccessToken = () => Cookies.get('accessToken') || '';
export const getRefreshToken = () => Cookies.get('refreshToken') || '';

export const getTokens = () => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken()
});

export const setAccessToken = (accessToken: string) => {
  Cookies.set('accessToken', accessToken, config.cookieOptions);
};

export const setRefreshToken = (refreshToken: string) => {
  Cookies.set('refreshToken', refreshToken, config.cookieOptions);
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

export const removeTokens = () => {
  Cookies.remove('accessToken', config.cookieOptions);
  Cookies.remove('refreshToken', config.cookieOptions);
};

class TokenRefresh {
  private fetching: boolean = false;
  private fetchStart: boolean = false;
  private refreshToken: string = '';
  private queue = [];

  constructor() {
    setTimeout(() => this.runFetchInterval(), 200);
  }

  public async refresh(refreshToken) {
    if (!this.fetching) {
      this.fetching = true;
      this.refreshToken = refreshToken;
    }

    return new Promise(resolve => this.queue.push(resolve));
  }

  private async runFetchInterval() {
    setInterval(async () => {
      if (!this.fetchStart && this.fetching && this.refreshToken) {
        this.fetchStart = true;

        const refreshQuery = await gqlQuery(
          `
          mutation refreshTokens($refreshToken: String!) {
            refreshTokens(refreshToken: $refreshToken) {
              refreshToken
              accessToken
            }
          }
      `,
          { refreshToken: this.refreshToken }
        );

        if (refreshQuery.errors) {
          console.error(refreshQuery.errors);
        }

        const refreshData = refreshQuery.data.refreshTokens;

        this.queue.forEach(resolve => resolve(refreshData));

        this.fetchStart = false;
        this.fetching = false;
        this.refreshToken = '';
      }
    }, 500);
  }
}

const tokenRefresh = new TokenRefresh();

const refresh = async refreshToken => {
  const refreshData: any = await tokenRefresh.refresh(refreshToken);

  if (refreshData) {
    setTokens(refreshData.accessToken, refreshData.refreshToken);
    return refreshData.accessToken;
  }

  removeTokens();

  return '';
};

export const getNewAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    removeTokens();
    return '';
  }

  return promiseTimeout(3000, refresh(refreshToken)).catch(() => {
    console.error('refresh token timeout', refreshToken);
    removeTokens();
    return '';
  });
};
