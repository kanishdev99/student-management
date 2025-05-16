import { LightningElement, wire, track } from 'lwc';
import getCurrentUser from '@salesforce/apex/EventController.getCurrentUser';
import getMyEvents from '@salesforce/apex/EventController.getMyEvents';

export default class MyEventsLWC extends LightningElement {
    @track user;
    @track registrations = [];

    columns = [
        { label: 'Event Name', fieldName: 'name' },
        { label: 'Date', fieldName: 'date', type: 'date' },
        { label: 'Location', fieldName: 'location' }
    ];

    @wire(getCurrentUser)
    wiredUser({ error, data }) {
        if (data) {
            this.user = data;
        }
    }

    @wire(getMyEvents)
    wiredEvents({ error, data }) {
        if (data) {
            this.registrations = data.map(row => ({
                Id: row.Id,
                name: row.Event__r.Name,
                date: row.Event__r.Event_Date__c,
                location: row.Event__r.Location__c
            }));
        }
    }

    get showNoData() {
        return this.registrations.length === 0;
    }
}