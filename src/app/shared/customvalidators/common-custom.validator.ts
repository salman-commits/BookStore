import { AbstractControl, FormControl } from "@angular/forms";
import { of } from "rxjs";

export function lessThanTodayDate() {
    return function (control: FormControl) {
        let today: Date = new Date();
        const publishedDate = control.value;
        if (new Date(publishedDate) > today)
            return { "lessThanTodayDate": true };

        return null;
    };
}

export function convertDateToString(dt: Date | undefined): string {
    let publishedDate = new Date(dt!);
    var day = ("0" + publishedDate.getDate()).slice(-2);
    var month = ("0" + (publishedDate.getMonth() + 1)).slice(-2);
    return publishedDate.getFullYear() + "-" + month + "-" + day;
}

export function requiredFileType(types: string[]) {
    return function (control: FormControl) {
        const file = control.value;
        let isValid = false;
        if (file) {
            const extension = file.split('.').pop().toLowerCase();
            for (var i = 0; i < types.length; i++) {
                if (types[i].toLowerCase() === extension.toLowerCase()) {
                    isValid = true;
                }
            }
            if (!isValid) {
                return { requiredFileType: true };
            }
            return null;
        }
        return null;
    };
}

export function emailValidator() {
    return function (control: FormControl) {
        const emailText = control.value;
        const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        let isValidEmail = emailRegEx.test(emailText);
        if (emailText === '' || isValidEmail) {
            return null;
        } else {
            return { emailValidator: true };
        }
    };
}

export function transformError(err: { [key: string]: any }) {
    const messages: string[] = [];

    if (err) {
      for (let key of Object.keys(err)) {
        for (let message of err[key]) {
          messages.push(`${message}`);
        }
      }
    }
    return messages;
  }

export function emailDomain(control: AbstractControl): { [key: string]: any } | null {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);
    if (email === '' || domain.toLowerCase() === 'pragimtech.com') {
        return null;
    } else {
        return { 'emailDomain': true };
    }
}