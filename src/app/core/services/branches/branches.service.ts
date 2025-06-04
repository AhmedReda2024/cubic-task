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
      'https://81.29.111.142:8085/CVM/CVMMobileAPIs/api/getBranches'
    );
  }
}
