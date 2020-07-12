import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('searchForm') searchForm: NgForm;  

  constructor(private router: Router) { }

  ngOnInit(): void {

  }
  onSearchClick() {
    this.router.navigate(['/search', this.searchForm.value.searchBox.toLowerCase()]);
  }

}
