import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TemplateFormComponent } from "./template-form.component";
import { TemplateFormRoutingModule } from './template-form-routing.module';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    TemplateFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    TemplateFormRoutingModule
  ]
})
export class TemplateFormModule { }
