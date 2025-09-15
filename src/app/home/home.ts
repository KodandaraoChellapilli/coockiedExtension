import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChromeService } from '../services/chrome';
import { EmployeeService, Employee } from '../services/employee';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  // -------- Cookies --------
  cookies: any[] = [];
  getUrl = '';
  blockUrl = '';

  // -------- Employees --------
  employees: Employee[] = [];
  firstName = '';
  lastName = '';
  email = '';
  title = '';

  constructor(private chromeService: ChromeService, private empService: EmployeeService) {
    this.fetchEmployees(); // prefetch employees
  }

  // -------- Cookie methods --------
  fetchCookies() {
    let url = (this.getUrl || '').trim() || 'https://www.google.com';
    if (!url.startsWith('http')) url = 'https://' + url;

    this.chromeService
      .getCookies(url)
      .then((c) => (this.cookies = c))
      .catch((err) => alert(err));
  }

  onDeleteCookie(c: any) {
    this.chromeService
      .deleteCookie(c)
      .then(() => this.fetchCookies())
      .catch((err) => alert(err));
  }

  onBlockHttpCookie() {
    this.chromeService
      .blockHttpCookie(this.blockUrl)
      .then(() => {
        alert(`HTTP cookies blocked for ${this.blockUrl}`);
        this.blockUrl = '';
      })
      .catch((err) => alert(err));
  }

  // -------- Employee methods --------
  fetchEmployees() {
    this.empService.getEmployees().subscribe({
      next: (data: Employee[]) => (this.employees = data),
      error: (err: any) => console.error('fetchEmployees error', err),
    });
  }

  createEmployee() {
    if (!this.firstName || !this.lastName || !this.email) {
      alert('First name, last name and email are required');
      return;
    }
    const emp: Employee = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      title: this.title,
    };
    this.empService.createEmployee(emp).subscribe({
      next: () => {
        this.firstName = this.lastName = this.email = this.title = '';
        this.fetchEmployees();
      },
      error: (err: any) => alert('Create failed: ' + err.message),
    });
  }

  editEmployee(e: Employee) {
    const updatedFirst = prompt('First name', e.firstName) || e.firstName;
    const updatedLast = prompt('Last name', e.lastName) || e.lastName;
    const updatedEmail = prompt('Email', e.email) || e.email;
    const updatedTitle = prompt('Title', e.title || '') || e.title;

    const updated: Employee = {
      id: e.id,
      firstName: updatedFirst,
      lastName: updatedLast,
      email: updatedEmail,
      title: updatedTitle,
    };
    this.empService.updateEmployee(updated).subscribe({
      next: () => this.fetchEmployees(),
      error: (err: any) => alert('Update failed: ' + err.message),
    });
  }

  deleteEmployee(e: Employee) {
    this.empService.deleteEmployee(e.id).subscribe({
      next: () => this.fetchEmployees(),
      error: (err: any) => alert('Delete failed: ' + err.message),
    });
  }
}
