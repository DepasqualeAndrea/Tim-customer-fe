import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services';
import { RouteHash } from 'app/modules/checkout/login-register/tim-retirees/login-register-tim-retirees/route-hashes.enum';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-migration-form-ndg',
  templateUrl: './migration-form-ndg.component.html',
  styleUrls: ['./migration-form-ndg.component.scss']
})
export class MigrationFormNdgComponent implements OnInit {

  @Input() content: any

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
  ) { }

  taxcodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$'
  form: FormGroup

  ngOnInit() {
    this.form = this.createForm()
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      taxcode: [null, { validators: [Validators.required, Validators.pattern(this.taxcodePattern)] }],
    })
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty)
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.getFieldInvalidError(formControlName) && this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }

  isValid() {
    return this.form.valid
  }

  ndgMigration() {
    const controls = this.form.controls
    const payload = {
      user: {
        taxcode: controls['taxcode'].value
      }
    }
    this.userService.userMigration(payload).pipe(catchError((err) => {
      this.handleMigrationError(err)
      return err}))
    .subscribe(migrationUser => migrationUser && this.handleMigrationSuccess());
    this.navigateToLoginRegister()
  }

  private handleMigrationSuccess(): void {
    this.toastrService.success(this.content.migration_successful)
  }

  private handleMigrationError(err): void {
    if (err.status === 401) {
      this.toastrService.error(this.content.migration_unsuccessful)
    }
  }
  
  navigateToLoginRegister() : void {
    this.router.navigate( ['/user-access'], {fragment: RouteHash.LOGIN});
  }
}
