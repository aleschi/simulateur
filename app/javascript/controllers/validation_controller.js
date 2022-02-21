import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static targets = [ 'form','submitBouton', 'emploif','emploifEchelon','dureefEchelon','finfEchelon'];

  	connect() {
  	 this.validateForm();
  	}

    validateForm() {
        let isValid = true;

        // Tell the browser to find any required fields
        let requiredFieldSelectors = 'select:required';
        let requiredFields = this.formTarget.querySelectorAll(requiredFieldSelectors);
        
        requiredFields.forEach((field) => {

          // For each required field, check to see if the value is empty
          // if so, we focus the field and set our value to false
          if (!field.disabled && !field.value.trim()) {
            //field.focus();
            isValid = false;

          }
        });

        if (this.emploifTarget.value != "Aucun" && this.emploifTarget.value != ""){
      
          if (this.emploifEchelonTarget.value == "" || this.dureefEchelonTarget.value == "" ||  this.finfEchelonTarget.value == ""){
            isValid = false;
          }
        }

        if (isValid==true){
            this.submitBoutonTarget.classList.remove("bouton_inactive")
        }else{
            this.submitBoutonTarget.classList.add("bouton_inactive")
        }

        return isValid;

    }

    submitForm(event) {
        let isValid = this.validateForm(this.formTarget);

        // If our form is invalid, prevent default on the event
        // so that the form is not submitted
        if (!isValid) {
          event.preventDefault();
        }
    }

}
