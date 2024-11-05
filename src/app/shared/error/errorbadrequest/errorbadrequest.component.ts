import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-errorbadrequest',
  templateUrl: './errorbadrequest.component.html',
  styleUrls: ['./errorbadrequest.component.css']
})
export class ErrorBadRequestComponent implements OnInit {
  @Input() errorList: string[] = [];

  constructor() {
  }
  ngOnInit(): void {
  }
}
