import { LightningElement, track, wire } from 'lwc';
import getEvents from '@salesforce/apex/EventController.getEvents';
import isAdminUser from '@salesforce/apex/EventController.isAdminUser';
import deleteEvent from '@salesforce/apex/EventController.deleteEvent';
import getRegistrationsByEvent from '@salesforce/apex/EventController.getRegistrationsByEvent';
import deleteRegistration from '@salesforce/apex/EventController.deleteRegistration';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class AdminEvent extends LightningElement {
    @track isAdmin = false;
    @track events = [];
    @track selectedEventId = null;
    @track showForm = false;
    @track showRegistrations = false;
    @track registrations = [];
    @track selectedEventName = '';
    @track editRegId = null;

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Date', fieldName: 'Event_Date__c', type: 'date' },
        { label: 'Type', fieldName: 'Event_Type__c' },
        { label: 'Location', fieldName: 'Location__c' },
        { label: 'Max', fieldName: 'Max_Attendees__c', type: 'number' },
        { label: 'Registered', fieldName: 'Current_Attendees__c', type: 'number' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Edit', name: 'edit' },
                    { label: 'Delete', name: 'delete' },
                    { label: 'View Registrations', name: 'view_registrations' }
                ]
            }
        }
    ];

    registrationColumns = [
        { label: 'Attendee Name', fieldName: 'AttendeeName' },
        { label: 'Attendee Email', fieldName: 'Attendee_Email__c' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Edit', name: 'edit' },
                    { label: 'Delete', name: 'delete' }
                ]
            }
        }
    ];

    @wire(isAdminUser)
    checkAdmin({ data }) {
        this.isAdmin = data;
    }

    @wire(getEvents)
    loadEvents;

    get eventList() {
        return this.loadEvents.data;
    }

    openNewForm() {
        this.selectedEventId = null;
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
    }

    closeRegistrations() {
        this.showRegistrations = false;
    }

    get formTitle() {
        return this.selectedEventId ? 'Edit Event' : 'New Event';
    }

    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;

        if (action === 'edit') {
            this.selectedEventId = row.Id;
            this.showForm = true;
        } else if (action === 'delete') {
            deleteEvent({ eventId: row.Id })
                .then(() => {
                    this.showToast('Success', 'Event deleted', 'success');
                    return refreshApex(this.loadEvents);
                })
                .catch(error => {
                    this.showToast('Error', this.getErrorMessage(error), 'error');
                });
        } else if (action === 'view_registrations') {
            this.selectedEventId = row.Id;
            this.selectedEventName = row.Name;
            this.loadRegistrations(row.Id);
        }
    }

    loadRegistrations(eventId) {
        getRegistrationsByEvent({ eventId })
            .then(data => {
                if (data) {
                    this.registrations = data.map(reg => ({
                        ...reg,
                        AttendeeName: reg.Attendee__r?.Name || 'N/A'
                    }));
                    this.showRegistrations = true;
                }
            })
            .catch(error => {
                this.showToast('Error', this.getErrorMessage(error), 'error');
            });
    }

    handleRegistrationAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;

        if (action === 'edit') {
            this.editRegId = row.Id;
        } else if (action === 'delete') {
            deleteRegistration({ registrationId: row.Id })
                .then(() => {
                    this.showToast('Success', 'Registration deleted', 'success');
                    this.registrations = this.registrations.filter(reg => reg.Id !== row.Id);
                })
                .catch(error => {
                    this.showToast('Error', this.getErrorMessage(error), 'error');
                });
        }
    }

    closeEditRegForm() {
        this.editRegId = null;
    }

    handleRegSaveSuccess() {
        this.showToast('Success', 'Registration updated', 'success');
        this.editRegId = null;
        this.loadRegistrations(this.selectedEventId);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    getErrorMessage(error) {
        return error?.body?.message || error?.message || 'Unknown error';
    }
}
