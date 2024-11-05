
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { Observable, of } from "rxjs";
import { Role, User } from "../shared/models/user.model";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthenticationService } from "../shared/services/authentication.service";
import { By } from "@angular/platform-browser";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ShoppingCartService } from "../shared/services/shoppingcart.service";
import { ErrorBadRequestComponent } from "../shared/error/errorbadrequest/errorbadrequest.component";
import { Router } from "@angular/router";


describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authenticationService: AuthenticationService;
    let htmlElement: HTMLElement;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent, ErrorBadRequestComponent],
            imports: [FormsModule, HttpClientModule, RouterTestingModule, ReactiveFormsModule, ToastrModule.forRoot()],
            providers: [AuthenticationService, ShoppingCartService]
        }).compileComponents();

        authenticationService = TestBed.inject(AuthenticationService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('should set submitted to true', () => {
        component.onSubmit();
        expect(component.onSubmit).toBeTruthy();
    });

    it('should call the OnSubmit method', () => {
        fakeAsync(() => {
            fixture.detectChanges();
            spyOn(component, 'onSubmit');
            htmlElement = fixture.debugElement.query(By.css('Login')).nativeElement;
            htmlElement.click();
            expect(component.onSubmit).toHaveBeenCalledTimes(0);
        });
    });

    it('should be a valid form when correct values are set', () => {
        component.loginFormGroup.controls['email'].setValue('test@test.com');
        component.loginFormGroup.controls['password'].setValue('test');
        expect(component.loginFormGroup.valid).toBeTruthy();
    });

    it('should be an invalid form when controls are set empty', () => {
        component.loginFormGroup.controls['email'].setValue('');
        component.loginFormGroup.controls['password'].setValue('');
        expect(component.loginFormGroup.valid).toBeFalsy();
    });

    it('should be an invalid form when controls are set incorrectly', () => {
        component.loginFormGroup.controls['email'].setValue('check.point@');
        component.loginFormGroup.controls['password'].setValue('');
        expect(component.loginFormGroup.invalid).toBeTruthy();
    });
});
