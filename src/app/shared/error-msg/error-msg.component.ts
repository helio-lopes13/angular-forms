import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormValidations } from '../form-validation';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.css']
})
export class ErrorMsgComponent implements OnInit {

  //@Input() mostrarErro: boolean;
  //@Input() mensagemErro: string;
  
  @Input() controle: FormControl;
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
  }

  get errorMessage() {
    for (const propertyName in this.controle.errors) {
      if (this.controle.errors.hasOwnProperty(propertyName) && (this.controle.touched || this.controle.dirty)) {
        return FormValidations.getErrorMessage(this.label, propertyName, this.controle.errors[propertyName]);
      }
    }
    return null;
  }

}
