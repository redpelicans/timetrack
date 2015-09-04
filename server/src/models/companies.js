import _ from 'lodash';
import async from 'async';
import mongobless, {ObjectId} from 'mongobless';

@mongobless({collection: 'companies'})
export class Company { 

  // constructor({type='step', title, description, startDate, dueDate, progress, projectId, userId} = {}){
  //   this.type = type;
  //   this.title = title;
  //   if(description)this.description = description;
  //   if(startDate)this.startDate = startDate;
  //   if(dueDate)this.dueDate = dueDate;
  //   if(progress || progress == 0)this.establishedProgress = progress;
  //   this.projectId = projectId;
  //   this.userId = userId;
  //   
  // }

  static bless(obj){
    switch (obj.type) {
      case 'client':
        return mongobless.bless.bind(Client)(obj);
      case 'tenant':
        return mongobless.bless.bind(Tenant)(obj);
      default:
        return mongobless.bless.bind(Company)(obj);
    }
  }

  equals(company){
    return this._id.equals(company._id);
  }

}

@mongobless()
export class Client extends Company{
}

@mongobless()
export class Tenant extends Company{
}
