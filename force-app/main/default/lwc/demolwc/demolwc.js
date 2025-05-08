import { LightningElement, track } from 'lwc';

export default class Demolwc extends LightningElement {
   @track firstNumber;
   @track secondNumber;
   resultValue;
   handleNumberOneChange(event)
   {
    this.firstNumber= parseInt(event.target.value);
   }
   handleNumberTwoChange(event)
   {
    this.secondNumber = parseInt(event.target.value);
   }
   addition()
   {
    this.resultValue = parseInt(this.firstNumber) + parseInt(this.secondNumber);
   }
   subtraction()
   {
    this.resultValue = this.firstNumber - this.secondNumber;
   }
   multiplication()
   {
    this.resultValue = this.firstNumber * this.secondNumber;
   }
   division()
   {
    this.resultValue = this.firstNumber / this.secondNumber;
   }
}