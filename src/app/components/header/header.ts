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
  username = '';
  password = '';

  login() {
    if (!this.username || !this.password) {
      alert('Enter both username and password!');
      return;
    }
    alert(`Logging in as ${this.username} (this is a UI stub).`);
  }
}
