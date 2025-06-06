import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  constructor(private httpClient: HttpClient) {}

  getBranches(): Observable<any> {
    return this.httpClient.get(
      'https://cubic.sevencsolutions.com/api/getBranches'
    );
  }
}
