import { User } from '../models/user.model';

export class CheckTenantAndUserType {

  static check(tenantType: string, user: User): boolean {
    const userProperyString = user.business === true  ? 'business' :
                              user.business === false ? 'personal' : null;
    if (!userProperyString) {
      return tenantType === 'business' ? false : true;
    }
    if (tenantType === userProperyString) {
      return true;
    }
    if (!tenantType && userProperyString === 'personal') {
      return true;
    }
    return false;
  }

}
