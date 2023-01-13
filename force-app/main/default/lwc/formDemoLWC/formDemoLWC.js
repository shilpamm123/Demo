import { LightningElement, track } from 'lwc';
import { returnSum as util } from 'c/utility';

                  

export default class FormDemoLWC extends LightningElement {

   @track input1=0;
   @track input2=0;
   @track input3=0;
   @track sum;
   @track showErrorMessage = true;

handleChange(event){

  let changedValue  = event.target.label;
  switch(changedValue)
  {
  case "input1":
      this.input1 = event.target.value;
     break;
  case "input2":
      this.input2 = event.target.value;
     break;
  case "input3":
      this.input3 = event.target.value;
    break;
  default :
      break;
  }
  this.validateAddressBook();

}

calculateSum()
{
    
    this.sum = util(Number(this.input1),Number(this.input2),Number(this.input3));
    alert("sum is=="+this.sum);
}

validateAddressBook() {

  var input1InputField = this.template.querySelector('.input1_class');
  var input2InputField = this.template.querySelector('.input2_class');
  var input3InputField = this.template.querySelector('.input3_class');
  
  if (input1InputField.checkValidity() && input2InputField.checkValidity() && input3InputField.checkValidity() )
  this.showErrorMessage = false;
  else
  this.showErrorMessage = true;
  }
  


}