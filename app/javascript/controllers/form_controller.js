import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static get targets() {
      return [ 'form','email','password','submitBouton','error','error2','credentials'];
    }
  	connect() {      
        
  	}

    changeForm(e){
      e.preventDefault();
      this.error2Target.classList.add('fr-hidden');
      this.errorTarget.classList.add('fr-hidden');
      this.credentialsTarget.classList.remove('fr-fieldset--error');

    }

    submitForm(e){
      let valid = true;
      if (this.passwordTarget.value == ""){
        valid = false;
      }
      if (this.emailTarget.value == "" ){
        valid = false;
      }
      if (valid == false ){
        this.error2Target.classList.remove('fr-hidden');
        this.credentialsTarget.classList.add('fr-fieldset--error');
        e.preventDefault();
      }
    }

    resultForm(event){
        if(event.detail.success == false ){
          this.errorTarget.classList.remove('fr-hidden');
          this.credentialsTarget.classList.add('fr-fieldset--error');
        } 
    }

}
