import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Book, BookCategory, BookViewModel } from 'src/app/shared/models/book.model';
import { BookFilter } from '../models/bookfilter.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookStoreService {

  constructor(private http: HttpClient) {
  }
  bookFilter = new BookFilter();

  setBookFilter(params: BookFilter) {
    this.bookFilter = params;
  }
  getBookFilter() {
    return this.bookFilter;
  }

  getBookCategories() {    
    return this.http.get<BookCategory[]>(`${environment.apiUrl}/api/BookStore/GetBookCategories`);
  }

  getBooksFromAPI() {
    let bookParams = this.getBookFilter();
    return this.http.post<any>(
      `${environment.apiUrl}/api/BookStore/GetAllBook`, JSON.stringify(bookParams),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    )
  }

  createUpdateBook(newBook: any): Observable<HttpResponse<any>> {    
    return this.http.post<HttpResponse<any>>(`${environment.apiUrl}/api/BookStore/CreateUpdateBook`,
      newBook, { observe: 'response' });
  }

  deleteBook(id: number) {
    return this.http.delete<HttpResponse<any>>(`${environment.apiUrl}/api/BookStore/DeleteBookById/${id}`);//, this.httpOptions);
  }

  getBookById(id: number) {
    return this.http.get<Book>(`${environment.apiUrl}/api/BookStore/GetBookById/${id}`);
  }

  getBookForCreate() {
    return this.http.get<BookViewModel>(`${environment.apiUrl}/api/BookStore/GetBookViewModelForCreate`);
  }
  editBookById(id: number) {
    return this.http.get<BookViewModel>(`${environment.apiUrl}/api/BookStore/EditBookById/${id}`);
  }

  getBookImageById(id: number): Observable<string> {
    return this.http.get(`${environment.apiUrl}/api/BookStore/GetImageById/${id}`, { responseType: 'blob' })
      .pipe(
        switchMap(response => this.readImageFile(response))
      );
  }

  private readImageFile(blob: Blob): Observable<string> {
    return Observable.create((obs: { error: (arg0: ProgressEvent<FileReader>) => any; next: (arg0: string | ArrayBuffer | null) => any; complete: () => any; }) => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }

}
