import { Injectable } from '@angular/core';

export interface CookieInfo {
  name: string;
  value: string;
  domain: string;
  path: string;
  expirationDate?: number;
  secure: boolean;
  httpOnly: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChromeService {
  constructor() {}

  getCookies(url: string): Promise<CookieInfo[]> {
    return new Promise((resolve, reject) => {
      if (!(window as any).chrome || !(window as any).chrome.cookies) {
        reject('chrome.cookies API not available. Open in Chrome extension popup.');
        return;
      }
      (window as any).chrome.cookies.getAll({ url }, (cookies: any[]) => {
        if ((window as any).chrome.runtime?.lastError) {
          reject((window as any).chrome.runtime.lastError.message);
          return;
        }
        resolve(cookies || []);
      });
    });
  }

  deleteCookie(cookie: CookieInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!(window as any).chrome || !(window as any).chrome.cookies) {
        reject('chrome.cookies API not available.');
        return;
      }
      const domain = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
      const url = `https://${domain}${cookie.path}`;
      (window as any).chrome.cookies.remove({ url, name: cookie.name }, () => {
        if ((window as any).chrome.runtime?.lastError) {
          reject((window as any).chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    });
  }

  blockHttpCookie(urlInput: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!(window as any).chrome || !(window as any).chrome.declarativeNetRequest) {
        reject('chrome.declarativeNetRequest API not available.');
        return;
      }

      let url = (urlInput || '').trim();
      if (!url) {
        reject('Enter URL to block HTTP cookies!');
        return;
      }
      if (url.endsWith('/')) url = url.slice(0, -1);
      const urlPattern = url.includes('*') ? url : `*://${url}/*`;

      const ruleId: number = Date.now() & 0x7fffffff; // 32-bit integer
      const rule = {
        id: ruleId,
        priority: 1,
        action: { type: 'block' as any },
        condition: {
          urlFilter: urlPattern,
          resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'script', 'image'],
        },
      };

      (window as any).chrome.declarativeNetRequest.updateDynamicRules(
        { addRules: [rule], removeRuleIds: [] },
        () => {
          if ((window as any).chrome.runtime?.lastError) {
            reject((window as any).chrome.runtime.lastError.message);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
