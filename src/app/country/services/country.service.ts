import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { map, Observable, catchError, throwError, delay } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private _http = inject(HttpClient);

  public searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this._http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountries(resp)),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(
          () => new Error(`No se pudo obtener capital con ese query ${query}`)
        );
      })
    );
  }

  public searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    return this._http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountries(resp)),
      delay(2000),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(
          () => new Error(`No se puedo obtener País con ese query ${query}`)
        );
      })
    );
  }

  public searchCountryByAlphaCode(code: string) {
    return this._http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`).pipe(
      map((resp) => CountryMapper.mapRestCountryToCountries(resp)),
      map((countries) => countries.at(0)),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(
          () => new Error(`No se puedo obtener País con ese codigo ${code}`)
        );
      })
    );
  }
}
