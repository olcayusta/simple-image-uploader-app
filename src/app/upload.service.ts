import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpRequest, HttpSentEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadMultiple(files: FileList) {
    const formData = new FormData();
    formData.append('file', files[0]);

    return this.http.post<any>('http://localhost:1010/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>('http://localhost:1010/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
