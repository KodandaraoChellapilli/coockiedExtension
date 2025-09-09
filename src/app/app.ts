import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from './components/header/header';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Home, CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <app-home></app-home>
    </div>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('cookie-extension');
}
