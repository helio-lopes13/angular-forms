import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, empty } from 'rxjs';

import { DropdownService } from '../shared/services/dropdown.service';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { EstadoBr } from "../shared/models/estado-br.model";
import { FormValidations } from '../shared/form-validation';
import { VerificaEmailService } from "./services/verifica-email.service";
import { map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade.model';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  // formulario: FormGroup;
  estados: EstadoBr[];
  cidades: Cidade[];
  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private builder: FormBuilder,
    private client: HttpClient,
    private dropdown: DropdownService,
    private cep: ConsultaCepService,
    private verificaEmail: VerificaEmailService
  ) {
    super();
  }

  ngOnInit(): void {
    //this.verificaEmail.verificarEmail('email@email.com').subscribe();

    this.dropdown.getEstadosBR().subscribe(
      (dados) => (this.estados = dados)
    );
    this.cargos = this.dropdown.getCargos();
    this.tecnologias = this.dropdown.getTecnologias();
    this.newsletterOp = this.dropdown.getNewsletter();

    /*this.formulario = new FormGroup({
      nome: new FormControl('Hélio'),
      email: new FormControl('helio@exemplo.com'),

    });*/

    this.formulario = this.builder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, FormValidations.equalsTo('email')],
      endereco: this.builder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.requiredTrue],
      frameworks: this.buildFrameworks()
    });

    this.formulario.get('endereco.cep').statusChanges
    .pipe(
      distinctUntilChanged(),
      switchMap((status) => status === 'VALID' ?
        this.cep.consultaCEP(this.formulario.get('endereco.cep').value)
        : empty()
      )
    ).subscribe((dados) => {
      dados ? this.populaDadosForm(dados) : {} 
    });

    this.formulario.get('endereco.estado').valueChanges
    .pipe(
      map((estado) => (this.estados.filter((state) => (state.sigla === estado)))),
      map((estados) => (estados && estados.length > 0 ? estados[0].id : empty())),
      switchMap((id: number) => (
        this.dropdown.getCidadesBR(id)
      )),
    ).subscribe(
      (cidades) => {this.cidades = cidades}
    );
  }

  buildFrameworks() {
    const values = this.frameworks.map((value) => ( new FormControl(false) ));
    
    return this.builder.array(values, FormValidations.requireMinCheckbox(1));
    // return [
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false)
    // ];
  }
  
  submit() {
    console.log(this.formulario);
    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v, i) => (
        v ? this.frameworks[i] : null
      ))
      .filter(
        (v) => (v !== null)
      )
    });

    
    this.client.post('https://httpbin.org/post', JSON.stringify(valueSubmit))
      .subscribe((dados) => {
        console.log(dados);
        // resetando o form
        this.formulario.reset();
      }, (error: any) => {alert('erro')});
  }


  consultaCEP() {
    let cep = this.formulario.get('endereco.cep').value;
    //Nova variável "cep" somente com dígitos.

    if (cep != null && cep !== '') {

      this.cep.consultaCEP(cep)
      .subscribe(
        (dados) => {
          this.populaDadosForm(dados);
        }
      );
    }
  }

  populaDadosForm(dados) {
    const {
      complemento,
      bairro
    } = dados;

    const cidade = dados.localidade,
    estado = dados.uf,
    rua = dados.logradouro;

    console.log(rua, bairro, complemento, cidade, estado);
    if (rua && bairro && cidade && estado) {
      this.formulario.patchValue({
        endereco: {
          rua,
          bairro: `${bairro} ${complemento}`,
          cidade,
          estado,
        }
      });
    }
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        bairro: null,
        cidade: null,
        estado: null,
      }
    });
  }

  setarCargo() {
    const cargo = {
      nome: 'Dev',
      nivel: 'Pleno',
      desc: 'Dev Pl'
    };
    
    this.formulario.get('cargo').setValue(cargo);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ? 
    (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel && obj1.desc === obj2.desc) 
    : obj1 === obj2;
  }
  
  setarTecnologias() {
    this.formulario.get('tecnologias').setValue(['java', 'javascript', 'python']);
  }

  validarEmail(controle: FormControl) {
    return this.verificaEmail.verificarEmail(controle.value)
    .pipe(
      map((emailExiste) => (emailExiste ? { emailInvalido: true } : null))
    )
  }
}
