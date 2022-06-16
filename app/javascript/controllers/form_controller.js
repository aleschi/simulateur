import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static get targets() {
  return [ 'form','error'];
}
  	connect() {   
   
        
  	}

    submitForm(event){
        if(event.detail.success == false ){
            this.errorTarget.innerHTML = 'identifiant ou mot de passe non reconnu';
            this.errorTarget.classList.add('fr-error-text')
        } 
        else {
            Turbo.visit("/simulateur")
        } 
    }

}
