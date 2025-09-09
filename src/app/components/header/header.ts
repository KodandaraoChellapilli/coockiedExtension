import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  username: string = '';
  password: string = '';

  login() {
    if (!this.username || !this.password) {
      alert('Enter both username and password!');
      return;
    }

    // For now, just show an alert (later you can integrate with backend)
    alert(`Logging in as: ${this.username}`);
  }
}
