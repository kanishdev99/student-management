import { LightningElement, track } from 'lwc';
import deleteCaseRecord from '@salesforce/apex/CaseController.deleteCaseRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseDashboard extends LightningElement {
    @track selectedStatus = '';
    @track selectedPriority = '';
    @track selectedOrigin = '';

    @track selectedCaseId = null;
    @track isFormOpen = false;
    @track isReadOnly = false;

    handleFilterChange(event) {
        const { status, priority, origin } = event.detail;
        this.selectedStatus = status;
        this.selectedPriority = priority;
        this.selectedOrigin = origin;
    }

    handleView(event) {
        this.selectedCaseId = event.detail.caseId;
        this.isReadOnly = true;
        this.isFormOpen = true;
    }

    handleEdit(event) {
        this.selectedCaseId = event.detail.caseId;
        this.isReadOnly = false;
        this.isFormOpen = true;
    }

    handleDelete(event) {
        const caseId = event.detail.caseId;

        deleteCaseRecord({ caseId })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Case deleted',
                    variant: 'success'
                }));

                const caseListComponent = this.template.querySelector('c-case-list');
                if (caseListComponent && typeof caseListComponent.refreshCases === 'function') {
                    caseListComponent.refreshCases();
                }
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error deleting case',
                    message: error.body?.message || 'Unknown error',
                    variant: 'error'
                }));
            });
    }

    handleModalClose() {
        this.isFormOpen = false;
        this.selectedCaseId = null;
    }

    refreshCaseList() {
        const caseListComponent = this.template.querySelector('c-case-list');
        if (caseListComponent) {
            caseListComponent.refreshCases();
        }
        this.isFormOpen = false; 
    }
    handleNewCase() {
        this.selectedCaseId = null;
        this.isReadOnly = false;
        this.isFormOpen = true;
    }
    
}
