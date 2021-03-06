import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ICustomer, IOrder } from '../../app/shared/interfaces';
import { noUndefined } from '@angular/compiler/src/util';

@Injectable()
export class DataService {
  // Use the following properties if running the Docker containers via Docker Compose
  // customersUrl = 'http://localhost:3000/api/customers';
  // ordersUrl = 'http://localhost:3000/api/orders';

  // Use the following properties if running the app stand-alone with no external dependencies
  customersUrl = 'assets/customers.json';
  ordersUrl = 'assets/orders.json';
  baseUrl!: string;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<ICustomer[]> {
    return this.http
      .get<ICustomer[]>(this.customersUrl)
      .pipe(catchError(this.handleError));
  }

  getCustomer(id: number): Observable<ICustomer> {
    return this.http.get<ICustomer[]>(this.baseUrl + 'customers.json')
        .pipe(
            map(customers => {
                let customer = customers.filter((cust: ICustomer) => cust.id === id);
                return (customer && customer.length) ? customer[0] : null!;
            }),
            catchError(this.handleError)
        )
}

  getOrders(id: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.baseUrl + 'orders.json').pipe(
      map((orders) => {
        let custOrders = orders.filter(
          (order: IOrder) => order.customerId === id
        );
        return custOrders;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
