import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: `<br>`
})
export abstract class BaseFormComponent implements OnInit {

  formulario: FormGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

  abstract submit();

  onSubmit() {
    if (this.formulario.valid) {
      this.submit();
    } else {
      console.log('Form inválido.');
      this.verificarValidacoesForm(this.formulario);
    }
  }

  verificarValidacoesForm(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((campo) => {
      const controle = group.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      console.log(campo);
      if (controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificarValidacoesForm(controle)
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

  verificarValidTouched(campo: string) {
    let control = this.formulario.get(campo);
    return !control.valid && (control.touched || control.dirty);
  }

  verificarRequired(campo: string) {
    let control = this.formulario.get(campo);
    return (control.hasError('required') &&
      (control.touched || control.dirty));
  }
  
  verificarEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if (campoEmail.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    } 
  }

  aplicarCSSErro(campo: string) {
    return {
      'is-invalid': this.verificarValidTouched(campo)
    };
  }

}
