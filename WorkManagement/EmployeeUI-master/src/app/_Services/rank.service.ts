import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rank } from '../_Models/Rank';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RankService {

  constructor(private http: HttpClient) { }

  private rankUrl = 'http://localhost:50182/api/rank';

  getRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(this.rankUrl);
  }

  getRank(id: number): Observable<Rank>{
    const url = `${this.rankUrl}/${id}`;

    return this.http.get<Rank>(url);
  }

  addRank(rank: Rank): Observable<Rank> {
    return this.http.post<Rank>(this.rankUrl, rank, httpOptions);
  }

  putRank(rank: Rank | number): Observable<any> {
    const id = typeof rank === 'number' ? rank : rank.ID;
    const url = `${this.rankUrl}/${id}`;

    return this.http.put(url, rank, httpOptions);
  }

  deleteRank(rank: Rank | number): Observable<Rank> {
    const id = typeof rank === 'number' ? rank : rank.ID;
    const url = `${this.rankUrl}/${id}`;

    return this.http.delete<Rank>(url, httpOptions);
  }
}
