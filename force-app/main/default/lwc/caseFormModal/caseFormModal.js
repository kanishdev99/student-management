import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseFormModal extends LightningElement {
    @api isOpen = false;
    @api recordId;
    @api isReadOnly = false;

    get modalTitle() {
        if (this.isReadOnly) return 'View Case';
        return this.recordId ? 'Edit Case' : 'New Case';
    }

    get isEditable() {
        return !this.isReadOnly;
    }

    handleSuccess() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Case saved successfully',
            variant: 'success'
        }));

        this.dispatchEvent(new CustomEvent('casesaved'));
        this.closeModal();
    }

    handleCancel() {
        this.closeModal();
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}
