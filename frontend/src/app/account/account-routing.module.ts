import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";
import { VerifyEmailComponent } from "./verify-email.component";
import { ForgotPasswordComponent } from "./forgot-password.component";
import { ResetPasswordComponent } from "./reset-password.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "verify-email", component: VerifyEmailComponent },
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "reset-password", component: ResetPasswordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}

// This module defines the routing for the account-related components in an Angular application. It sets up routes for login, registration, email verification, password reset, and forgot password functionalities. The routes are nested under a main layout component, which serves as a parent for all account-related views.
// The routes are defined in an array and imported into the RouterModule, which is then exported for use in the application. This modular approach helps in organizing the routing structure and makes it easier to manage and maintain the code.
