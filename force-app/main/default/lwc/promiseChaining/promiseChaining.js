import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import integrateAccount from '@salesforce/apex/createAccountController.integrateAccount';
export default class PromiseChaining extends LightningElement {
    accountName;
    isLoading;
    handleCreate(){
        const inputFields = this.template.querySelectorAll('lightning-input');

        const allValid = this.checkFieldsValidity(inputFields);

        if(allValid){
            const fields = {};
            fields[ACCOUNT_NAME_FIELD.fieldApiName] = this.accountName;

            const accountInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
            this.isLoading = true;
            createRecord(accountInput)
                .then(result => {
                    console.log('account created with id: ', result.id);
                    return integrateAccount({ accountId: result.id });
                })
                .then(result => {
                    console.log('success!', result);
                })
                .catch(error => {
                    console.log('error', error);
                })
                .finally(() => this.isLoading = false );
        }
    }

    checkFieldsValidity(fields){
        const allValid = [...fields].reduce((validSoFar, field) => {
            return validSoFar && field.reportValidity();
        }, true);

        return allValid;
    }

    handleChange(event){
        if(event.target.name === "accountName"){
            this.accountName = event.target.value;
        }
    }
}