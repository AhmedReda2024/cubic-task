import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  constructor(private httpClient: HttpClient) {}

  private branchesUrl = `${environment.apiBaseUrl}/getBranches`;

  getBranches(): Observable<any> {
    return this.httpClient.get(
      'http://81.29.111.142:8085/CVM/CVMMobileAPIs/api/getBranches'
    );
  }
}
