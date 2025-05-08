import { LightningElement, api, track, wire } from 'lwc';
import getFilteredCases from '@salesforce/apex/CaseController.getFilteredCases';
import { refreshApex } from '@salesforce/apex';


export default class CaseList extends LightningElement {
    @api status = '';
    @api priority = '';
    @api origin = '';
    @track cases = [];
    @track error;

    

   

    wiredCasesResult; 
    @wire(getFilteredCases, { status: '$status', priority: '$priority', origin: '$origin' })
    wiredCases(result) {
        this.wiredCasesResult = result; 
        if (result.data) {
            this.cases = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.cases = [];
        }
    }

   
    @api
    refreshCases() {
        if (this.wiredCasesResult) {
            refreshApex(this.wiredCasesResult);
        }
    }

    handleClick(event) {
        const action = event.target.dataset.action;
        const caseId = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent(action, {
            detail: { caseId },
            bubbles: true,
            composed: true
        }));
    }
  
}



