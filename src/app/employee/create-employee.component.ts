import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  fullNameLength = 0;

  validationMessages = {
    fullName: {
      required: 'Full Name is required',
      minlength: 'Full Name must be greater than 2 chars',
      maxlength: 'Full Name must bee less than 2 chars',
    },
    email: {
      required: 'Email is required',
      emailDomain: 'Email Domain should be test.com',
    },
    confirm: {
      required: 'Confirm email is required',
    },
    emailGroup: {
      matchEmail: 'Emails should be match',
    },
    phone: {
      required: 'Phone is required',
    },
    skillName: {
      required: 'SkillName is required',
    },
    experienceInYears: {
      required: 'Experience is required',
    },
    profiency: {
      required: 'Profiency is required',
    },
  };

  formErrors = {
    fullName: '',
    email: '',
    confirm: '',
    emailGroup: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    profiency: '',
  };
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email', [Validators.required]],
      emailGroup: this.formBuilder.group(
        {
          email: ['', [Validators.required, emailDomain]],
          confirm: ['', [Validators.required]],
        },
        { validator: matchEmail },
      ),
      phone: ['', []],
      skills: this.formBuilder.group({
        skillName: ['', [Validators.required]],
        experienceInYears: ['', [Validators.required]],
        profiency: ['beginner', [Validators.required]],
      }),
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((value: string) => {
      this.logValidationErrors(this.employeeForm);
      console.log(value);
      this.fullNameLength = value.length;
    });
  }

  logValidationErrors(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        console.log(`Key: ${key} value: ${abstractControl.value}`);

        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];

          this.formErrors[key] = '';
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  onContactPreferenceChange(preference: string) {
    debugger;
    const phoneControl = this.employeeForm.get('phone');

    if (preference === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  onSubmit() {
    console.log(this.employeeForm);
    this.employeeForm.patchValue({
      fullName: 'Sahin tech',
      emailGroup: {
        email: 'mali@sahin.com',
      },
      phone: '',
      skills: {
        skillName: 'Java',
        experienceInYears: 5,
        profiency: 'intermediate',
      },
    });
  }

  onLoadDataClick(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.employeeForm.errors);
  }
}

function emailDomain(control: AbstractControl): { [key: string]: any } {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@') + 1);

  if (domain.toLowerCase() === 'test.com') {
    return null;
  }
  return { emailDomain: true };
}

function emailDomainWithDomainParam(domain: string) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email: string = control.value;
    const currentDomain = email.substring(email.lastIndexOf('@') + 1);

    if (currentDomain.toLowerCase() === domain) {
      return null;
    }

    return { emailDomain: true };
  };
}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const email = group.get('email');
  const confirm = group.get('confirm');

  return email.value === confirm.value ? null : { emailMisMatch: true };
}
