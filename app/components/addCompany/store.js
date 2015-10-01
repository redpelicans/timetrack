import alt from '../../alt';
import { datasource, createStore } from 'alt/utils/decorators';
import AddCompanyActions from './actions';
import * as formo from '../../formo';
//import CompanyDataSource from './datasource';


let addCompanySchema = new formo.Schema('/Company', {
  name: {
    label: "Name",
    type: "string",
    required: true,
  },
  age: {
    label: "Age",
    type: "integer",
    required: true,
  },

  type: {
    label: "Type",
    type: "string",
    values: {
      client: 'Client', 
      partner: 'Partner',
      tenant: 'Tenant', 
    },
    defaultValue: 'client',
    required: true,
  },
  website: {
    label: "Website",
    type: "string",
  },
  mainCompany: {
    label: "Main Company",
    type: "string",
  },
  address: {
    street1 :{ 
      label: 'Street1',
      type: 'string'
    },
    street2 :{ 
      label: 'Street2',
      type: 'string'
    },
    zip :{ 
      label: 'zip',
      type: 'string'
    },
    city :{ 
      label: 'city',
      type: 'string'
    },
    country :{ 
      label: 'Country',
      type: 'string',
      defaultValue: 'France',
      required: true
    },
  },
  billing:{
    creditPeriod:{
      label: "Credit Period",
      type: "integer",
      unit: "Days",
      defaultValue: 30,
    },
    invoicingContacts:{
      label: "Invoicing Contacts",
      type: 'string',
    },
    vatNumber:{
      label: "VAT Number",
      type: 'string',
    },
    vatPct:{
      label: "VAT",
      type: 'number',
      unit: '%'
    },
    timeBillable:{
      minimum:{
        label: "Minimum Time Billable",
        type: 'number',
      },
      unit:{
        label: "Billable Unit",
        values: ['Day', 'Hour'],
        defaultValue: 'Day'
      }
    },
    setupPerDay:{
      hours:{
        label: 'Hours/Day',
        type: 'integer'
      },
      allowOverrun:{
        label: 'Allow Overrun',
        type: 'boolean'
      },
      disableSubmit:{
        label: 'Disable Submit If Lower',
        type: 'boolean'
      }
    },
    setupPerWeek:{
      includeWeekEnd:{
        label: 'Include Week End',
        type: 'boolean'
      },
    },
    reminder:{
      label: "Frequency to Send Reminder to Fill Timesheet",
      type: "integer",
      unit: 'Day'
    }
  }
});

let formoField = addCompanySchema.field.bind(addCompanySchema);

@createStore(alt)
//@datasource(CompanyDataSource)
export default class CompanyStore{
  constructor(){
    this.fields = {
      name: formoField('name'),
      age: formoField('age'),
      //type: formoField('type'),
    }
    this.bindActions(AddCompanyActions);
  }

  fieldChanged({field, value}){
    console.log(`${field.label} has changed to ${value}`);
    field.value = value;
    field.error = field.checkValue(value);
  }

  resetData(){
    addCompanySchema.resetData();
  }

  postData(){
    try{
      let data = addCompanySchema.getData();
      this.isSubmitted = true;
      console.log(data);
    }catch(e){
      console.log(e);
    }
  }
}
