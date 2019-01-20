import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
    skillName: '',
    experienceInYears: '',
    profiency: '',
  };
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      email: ['', Validators.required],
      skills: this.formBuilder.group({
        skillName: ['', [Validators.required]],
        experienceInYears: ['', [Validators.required]],
        profiency: ['beginner', [Validators.required]],
      }),
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

        if (abstractControl && !abstractControl.valid) {
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

  onSubmit() {
    console.log(this.employeeForm);
    this.employeeForm.setValue({
      fullName: 'Sahin tech',
      email: 'mali@sahin.com',
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
