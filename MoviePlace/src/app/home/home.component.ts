import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchBox: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
  onSearchClick() {
    this.router.navigate(['/search', this.searchBox]);
  }

}
