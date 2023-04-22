import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const curr = new Date();
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    const KR_TIME_DIFF = 18 * 60 * 60 * 1000;
    const kr_curr = new Date(utc + KR_TIME_DIFF);

    return next.handle().pipe(
      map((data) => ({
        success: true,
        code: 201,
        data,
        kr_curr,
      }))
    );
  }
}
