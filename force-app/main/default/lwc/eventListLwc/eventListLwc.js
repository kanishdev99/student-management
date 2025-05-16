import { LightningElement, track } from 'lwc';
import getFilteredEvents from '@salesforce/apex/EventController.getFilteredEvents';
import isAdminUser from '@salesforce/apex/EventController.isAdminUser';
import getAllActiveUsers from '@salesforce/apex/EventController.getAllActiveUsers';
import registerEvent from '@salesforce/apex/EventController.registerEvent';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EventListLWC extends LightningElement {
    @track events = [];
    @track showRegistrationForm = false;
    @track isAdmin = false;
    @track userOptions = [];
    @track selectedUserId = '';
    @track attendeeEmail = '';
    selectedEventId = '';
    selectedType = 'All';
    searchKey = '';

    typeOptions = [
        { label: 'All', value: 'All' },
        { label: 'Internal', value: 'Internal' },
        { label: 'External', value: 'External' }
    ];

    connectedCallback() {
        this.fetchEvents();
        this.checkAdmin();
    }

    fetchEvents() {
        getFilteredEvents({ eventType: this.selectedType, searchKey: this.searchKey })
            .then(result => {
                this.events = result;
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }

    checkAdmin() {
        isAdminUser()
            .then(result => {
                this.isAdmin = result;
                if (this.isAdmin) {
                    getAllActiveUsers()
                        .then(data => {
                            this.userOptions = data.map(user => ({
                                label: user.Name,
                                value: user.Id
                            }));
                        })
                        .catch(error => console.error('Error loading users:', error));
                }
            })
            .catch(error => console.error('Error checking admin status:', error));
    }

    handleTypeChange(event) {
        this.selectedType = event.detail.value;
        this.fetchEvents();
    }

    handleSearchChange(event) {
        this.searchKey = event.detail.value;
        this.fetchEvents();
    }

    handleOpenRegister(event) {
        this.selectedEventId = event.target.dataset.id;
        this.showRegistrationForm = true;
    }

    handleUserChange(event) {
        this.selectedUserId = event.detail.value;
    }

    handleEmailChange(event) {
        this.attendeeEmail = event.detail.value;
    }

    handleRegister() {
        if (this.isAdmin) {
            if (!this.selectedUserId || !this.attendeeEmail) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select a user and provide an email.',
                    variant: 'error'
                }));
                return;
            }

            registerEvent({
                eventId: this.selectedEventId,
                userId: this.selectedUserId,
                attendeeEmail: this.attendeeEmail
            })
                .then(() => {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Registration successful!',
                        variant: 'success'
                    }));
                    this.closeRegistrationForm();
                    this.fetchEvents();
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error',
                        message: error.body?.message || 'Something went wrong',
                        variant: 'error'
                    }));
                });
        }
    }

    closeRegistrationForm() {
        this.showRegistrationForm = false;
        this.selectedUserId = '';
        this.selectedEventId = '';
    }
}
