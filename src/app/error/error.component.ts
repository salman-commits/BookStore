import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {

  serverError: boolean | undefined;
  errorCode: number | undefined;
  statusText: string | undefined;
  errorMessage: string | undefined;
  modelState: any | undefined;

  constructor(private route: ActivatedRoute, private toastrService: ToastrService) {    
  }

  ngOnInit() {    
    this.route.paramMap.subscribe(params => {
      this.errorCode = Number(params.get('id'));
      this.statusText = params.get('errorMessage')!;      

      switch (this.errorCode) {
        case 401:      //login
          this.errorMessage = this.statusText + ', you are not authorized to access this information!';
          console.log(`Unauthorized!`);
          break;
        case 403:     //forbidden
          this.errorMessage = this.statusText;
          console.log(`forbidden!`);
          break;
        case 404:     //not found
          this.errorMessage = this.statusText;
          console.log(`not found!`);
          break;
        case 500:     //Internal Server Error
          this.errorMessage = this.statusText;
          console.log(`Internal Server Error!`);
          break;
        case 0:     //forbidden
          this.serverError = true;
          this.errorMessage = this.statusText + ', Backend API services are down!';
          console.log(`Backend API services are down!`);
          break;
      }
      this.toastrService.error(this.statusText, 'API Error', {
        timeOut: 3000,
      });
    });
  }
}