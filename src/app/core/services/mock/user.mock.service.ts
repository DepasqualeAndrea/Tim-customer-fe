import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { User } from '@model';
import { environment } from 'environments/environment';

export class UserMockService extends UserService {

  getTenantInfo() {
    throw new Error("getTenantInfo")
  }

  getUserDetails(userId: number): Observable<User> {
    throw new Error("getUserDetails")
  }
}
