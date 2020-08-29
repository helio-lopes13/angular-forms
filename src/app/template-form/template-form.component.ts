import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { NgForm } from '@angular/forms';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

interface Endereco {
  cep: string;
  numero: number;
  complemento: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface Usuario {
  nome: string;
  email: string;
  endereco: Endereco;
}

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: Usuario = {
    nome: null,
    email: null,
    endereco: {
      cep: null,
      numero: null,
      complemento: null,
      rua: null,
      bairro: null,
      cidade: null,
      estado: null
    }
  };

  constructor(
    private client: HttpClient,
    private cep: ConsultaCepService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(`Bem-vindo ${form.value.nome}, do e-mail ${form.value.email}`);

    console.log(this.usuario);

    this.client.post('https://httpbin.org/post', JSON.stringify(form.value))
      .pipe(map((res) => res))
      .subscribe((dados) => {
        console.log(dados);
        form.form.reset();
      });
  }

  consultaCEP(cep: string, f: NgForm) {
    if (cep != null && cep !== '') {
      this.cep.consultaCEP(cep)
      .subscribe(
        (dados) => {
          this.populaDadosForm(dados, f);
        }
      );
    }
  }

  populaDadosForm(dados, formulario: NgForm) {
    const {
      cep,
      complemento,
      bairro
    } = dados;

    const cidade = dados.localidade,
    estado = dados.uf,
    rua = dados.logradouro;
    
    console.log(cep, complemento, bairro, cidade, estado);
    /*formulario.setValue({
      ...formulario.value,
      endereco: {
        ...formulario.value.endereco,
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });*/

    formulario.form.patchValue({
      endereco: {
        cep,
        rua,
        bairro: `${bairro} ${complemento}`,
        cidade,
        estado,
      }
    });
  }

  resetaDadosForm(formulario: NgForm) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        bairro: null,
        cidade: null,
        estado: null,
      }
    });
  }

  verificarValidTouched(campo) {
    return !campo.valid && campo.touched;
  }

  aplicarCSSErro(campo) {
    return {
      'is-invalid': this.verificarValidTouched(campo)
    };
  }

}
