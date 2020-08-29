import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, tap } from 'rxjs/operators';
import { EstadoBr } from '../models/estado-br.model';
import { Cidade } from '../models/cidade.model';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(
    private client: HttpClient
  ) { }

  getEstadosBR() {
    return this.client.get<EstadoBr[]>('assets/dados/estadosbr.json');
  }

  getCidadesBR(idEstado: number) {
    return this.client.get<Cidade[]>('assets/dados/cidades.json').
    pipe(
      map((cidades: Cidade[]) => (cidades.filter((cidade) => (cidade.estado == idEstado))))
      // filter((v, i) => (v[i].estado === idEstado))
    );
  }

  getCargos() {
    return [
      {
        nome: 'Dev',
        nivel: 'Júnior',
        desc: 'Dev Jr'
      },
      {
        nome: 'Dev',
        nivel: 'Pleno',
        desc: 'Dev Pl'
      },
      {
        nome: 'Dev',
        nivel: 'Sênior',
        desc: 'Dev Sr'
      },
    ];
  }

  getTecnologias() {
    return [
      { nome: 'java', desc: 'Java'},
      { nome: 'javascript', desc: 'Javascript'},
      { nome: 'php', desc: 'PHP'},
      { nome: 'python', desc: 'Python'},
    ];
  }

  getNewsletter() {
    return [
      { valor: 's', desc: 'Sim' },
      { valor: 'n', desc: 'Não' }
    ];
  }
}
