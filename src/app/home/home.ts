import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  cookies: chrome.cookies.Cookie[] = [];
  blockUrl: string = '';
  getUrl: string = '';

  getCookies() {
    console.log('Get Cookies clicked:', this.getUrl);
    let url = this.getUrl.trim();
    if (!url) url = 'https://www.google.com';
    if (!url.startsWith('http')) url = 'https://' + url;
    console.log('Final URL for getCookies:', url);

    chrome.cookies.getAll({ url }, (cookies) => {
      console.log('Cookies received:', cookies);
      this.cookies = cookies;
      if (!cookies.length) alert(`No cookies found for ${url}`);
    });
  }

  deleteCookie(cookie: chrome.cookies.Cookie) {
    console.log('Delete cookie:', cookie);
    const domain = cookie.domain.startsWith('.') ? cookie.domain.substring(1) : cookie.domain;
    const url = `https://${domain}${cookie.path}`;
    chrome.cookies.remove({ url, name: cookie.name }, () => {
      console.log(`Cookie ${cookie.name} removed`);
      this.getCookies();
    });
  }

  blockHttpCookie() {
    console.log('Block HTTP Cookies clicked:', this.blockUrl);
    let url = this.blockUrl.trim();
    if (!url) {
      alert('Enter URL to block HTTP cookies!');
      return;
    }

    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url.startsWith('http')) url = `*://${url}/*`;

    console.log('Final URL pattern for blocking:', url);

    const rule: chrome.declarativeNetRequest.Rule = {
      id: Math.floor(Date.now() % 2147483647),
      priority: 1,
      action: { type: 'block' as chrome.declarativeNetRequest.RuleActionType },
      condition: {
        urlFilter: url,
        resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'script', 'image'],
      },
    };

    console.log('Rule to add:', rule);

    chrome.declarativeNetRequest.updateDynamicRules({ addRules: [rule], removeRuleIds: [] }, () => {
      console.log(`Rule added for ${url}`);
      alert(`HTTP cookies blocked for ${url}`);
      this.blockUrl = '';
    });
  }
}
