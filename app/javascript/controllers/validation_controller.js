import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static targets = [ 'form','submitBouton', 'emploif','emploifEchelon','dureefEchelon','finfEchelon','debutfEmploi',
    'errorCorps','age','date1','date2','date3',
    "emploif1","emploif2","emploif3","emploif4","emploif5","emploif6",
  "debutf1","debutf2","debutf3","debutf4","debutf5","debutf6",
  "dureef1","dureef2","dureef3","dureef4","dureef5","dureef6",];

  	connect() {
  	 this.validateForm();
  	}

    validateForm() {
        this.errorCorpsTarget.classList.add('visually-hidden');
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
      
          if (this.emploifEchelonTarget.value == "" || this.dureefEchelonTarget.value == "" ||  this.finfEchelonTarget.value == "" || this.debutfEmploiTarget.value == ""){
            isValid = false;
          }
        }

        const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
        const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
        const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
        [0,1,2,3,4,5].forEach((indice)=>{
          if (emploif_targets[indice].selectedIndex != 0){
            if (debut_targets[indice].selectedIndex == 0 || duree_targets[indice].selectedIndex == 0){
              isValid = false;
            }
          }
        })

        if (isValid==true){
            this.submitBoutonTarget.classList.remove("bouton_inactive");
            this.errorCorpsTarget.classList.add('visually-hidden');
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

          this.errorCorpsTarget.classList.remove('visually-hidden');
          this.errorCorpsTarget.innerHTML = "Vous devez remplir tous les champs obligatoires*";

          event.preventDefault();

        } else {
          // check dates ok 
          const age = parseInt(this.ageTarget.value);
          const dates = [parseInt(this.date1Target.value)+2022, parseInt(this.date2Target.value)+2022, parseInt(this.date3Target.value)+2022, parseInt(this.debutf1Target.value),parseInt(this.debutf2Target.value),parseInt(this.debutf3Target.value),parseInt(this.debutf4Target.value),parseInt(this.debutf5Target.value),parseInt(this.debutf6Target.value)];
          let date_invalid = true;

          dates.forEach((date) => {
            if (date >= 2022+67-age){
              date_invalid = false;
            }
          })

          

          if (date_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates renseignées sont incompatibles avec l'age renseigné";
          } else {
            this.errorCorpsTarget.classList.add('visually-hidden');
          } 
        }
    }

}
