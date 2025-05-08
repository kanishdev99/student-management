import { LightningElement, track, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import PRIORITY_FIELD from '@salesforce/schema/Case.Priority';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';

export default class CaseFilters extends LightningElement {
    @track status = '';
    @track priority = '';
    @track origin = '';

    statusOptions = [];
    priorityOptions = [];
    originOptions = [];

    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: STATUS_FIELD
    })
    statusPicklist({ data }) {
        if (data) {
            this.statusOptions = [{ label: 'All', value: '' }, ...data.values];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: PRIORITY_FIELD
    })
    priorityPicklist({ data }) {
        if (data) {
            this.priorityOptions = [{ label: 'All', value: '' }, ...data.values];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: ORIGIN_FIELD
    })
    originPicklist({ data }) {
        if (data) {
            this.originOptions = [{ label: 'All', value: '' }, ...data.values];
        }
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
        this.dispatchEvent(new CustomEvent('filterschange', {
            detail: {
                status: this.status,
                priority: this.priority,
                origin: this.origin
            }
        }));
    }
}
