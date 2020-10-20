import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  constructor(private http: HttpClient) {

  }

  uploadFile(file: File): Observable<any> {

    const formData = new FormData();
    formData.append('file', file);

    console.log(file);

    const headers = new HttpHeaders(
      {
        'x-rapidapi-host': 'thai-national-id.p.rapidapi.com',
        'x-rapidapi-key': '2089a08f43mshcfd04060e143a15p1d5c29jsn6bf541903273'
      }
    );

    return this.http.post('https://thai-national-id.p.rapidapi.com/idocr/detect/front', formData, { headers: headers });

  }
}
