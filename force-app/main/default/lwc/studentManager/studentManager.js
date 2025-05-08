import { LightningElement, track } from 'lwc';
import getStudents from '@salesforce/apex/StudentController.getStudents';
import createStudent from '@salesforce/apex/StudentController.createStudent';

export default class StudentManager extends LightningElement {
    @track name = '';
    @track age = '';
    @track grade = '';
    @track students = [];
    @track selectedGrade = '';

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Age', fieldName: 'Age__c', type: 'number' },
        { label: 'Grade', fieldName: 'Grade__c' }
    ];

    gradeOptions = [
        { label: 'All', value: '' },
        { label: '1st', value: '1st' },
        { label: '2nd', value: '2nd' },
        { label: '3rd', value: '3rd' },
        { label: '4th', value: '4th' },
        { label: '5th', value: '5th' }
    ];
    

    connectedCallback() {
        this.loadStudents();
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleAgeChange(event) {
        this.age = event.target.value;
    }

    handleGradeChange(event) {
        this.grade = event.target.value;
    }

    handleFilterChange(event) {
        this.selectedGrade = event.detail.value;
        this.loadStudents();
    }

    loadStudents() {
        getStudents({ gradeFilter: this.selectedGrade })
            .then(result => {
                this.students = result;
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }

    addStudent() {
        const newStudent = {
            Name: this.name,
            Age__c: parseInt(this.age),
            Grade__c: this.grade
        };
    
        createStudent({ newStudent })
            .then(created => {
                this.students = [ ...this.students, created ]; // Add to bottom
                this.name = '';
                this.age = '';
                this.grade = '';
            })
            .catch(error => {
                console.error('Error adding student:', error);
            });
    }
    
}
