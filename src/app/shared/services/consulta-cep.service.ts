import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(
    private client: HttpClient
  ) { }

  consultaCEP(cep: string) {
    console.log(cep);
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if (cep != '') {
      let validaCEP = /^[0-9]{8}$/;

      if (validaCEP.test(cep)) {
        return this.client.get(`//viacep.com.br/ws/${cep}/json`);
      }
    }

    return of({});
  }
}
