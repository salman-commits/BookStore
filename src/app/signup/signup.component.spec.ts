
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthenticationService } from "../shared/services/authentication.service";
import { By } from "@angular/platform-browser";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ErrorBadRequestComponent } from "../shared/error/errorbadrequest/errorbadrequest.component";
import { SignupComponent } from "./signup.component";


describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    let authenticationService: AuthenticationService;
    let htmlElement: HTMLElement;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SignupComponent, ErrorBadRequestComponent],
            imports: [FormsModule, HttpClientModule, RouterTestingModule, ReactiveFormsModule, ToastrModule.forRoot()],
            providers: [AuthenticationService]
        }).compileComponents();

        authenticationService = TestBed.inject(AuthenticationService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should retrieve user roles', fakeAsync(() => {
        const mockUserRoles = [
            { RoleId: 1, RoleName: 'Admin' },
            { RoleId: 2, RoleName: 'Manager' },
            { RoleId: 3, RoleName: 'User' }
        ]
        const authenticationServiceSpy = spyOn(authenticationService, 'getUserRoles').and.returnValue(of(mockUserRoles));
        component.getUserRoles();
        // Use tick() to simulate the passage of time until all asynchronous operations are completed
        tick();
        expect(component.userRoles).toEqual(mockUserRoles);
        expect(authenticationServiceSpy).toHaveBeenCalled();
    }));

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
            htmlElement = fixture.debugElement.query(By.css('Sign Up')).nativeElement;
            htmlElement.click();
            expect(component.onSubmit).toHaveBeenCalled;
        });
    });
});