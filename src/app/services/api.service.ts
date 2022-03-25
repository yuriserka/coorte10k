import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataEntry } from '../models/data';
import { DictionaryEntry } from '../models/dict';
import { LabelEntry } from '../models/label';

export interface HttpResponseWrapper<T> {
  size?: number;
  result: T;
}

export interface IBGELoc {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGEUFResponse extends IBGELoc {
  regiao: IBGELoc;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:3333';

  constructor(private readonly http: HttpClient) {}

  getDataForVariable(varCode: string) {
    return this.http.get<HttpResponseWrapper<DataEntry[]>>(
      `${this.baseUrl}/data/${varCode}`
    );
  }

  getDictionary() {
    return this.http.get<HttpResponseWrapper<DictionaryEntry[]>>(
      `${this.baseUrl}/dict`
    );
  }

  getLabelsForVariable(varCode: string) {
    return this.http.get<HttpResponseWrapper<LabelEntry[]>>(
      `${this.baseUrl}/labels/${varCode}`
    );
  }

  getIBGEInfo() {
    return this.http.get<IBGEUFResponse[]>(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
    );
  }
}
