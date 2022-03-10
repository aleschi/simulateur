import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static targets = [ 'form','submitBouton', 'emploif','emploifEchelon','dureefEchelon','finfEchelon','debutfEmploi',
    "resultEmploif","resultEchelonf","resultDureef","resultFinf","resultDebutf","boutonEdit",
    'errorCorps','age','date1','date2','date3','resultdate1','resultdate2','resultdate3',
    "emploif1","emploif2","emploif3","emploif4","emploif5","emploif6",
  "debutf1","debutf2","debutf3","debutf4","debutf5","debutf6",
  "dureef1","dureef2","dureef3","dureef4","dureef5","dureef6",
  "resultEmploif1","resultEmploif2","resultEmploif3","resultEmploif4","resultEmploif5","resultEmploif6",
  "resultDebutf1","resultDebutf2","resultDebutf3","resultDebutf4","resultDebutf5","resultDebutf6",
  "resultDureef1","resultDureef2","resultDureef3","resultDureef4","resultDureef5","resultDureef6",
  "trash1","trash2","trash3","trash4","trash5","trash6",
  'debutProjet','finProjet', 'resultdebutProjet', 'resultfinProjet', 'boutonDispo','contentdispo','boutonprojet',
  'age','corps','grade','echelon','duree','dureeTitle','dureeTitle2',
  'resultAge','resultCorps','resultGrade','resultEchelon','resultDuree','boutonSituation',
  "content1","content2","content3","content4","content5","content6",'error2'];

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
      
          if (this.emploifEchelonTarget.value == "" || this.finfEchelonTarget.value == "" || this.debutfEmploiTarget.value == ""){
            isValid = false;
          }
          if (this.dureeTitle2Target.classList.contains('select_inactive') == false && this.dureefEchelonTarget.value == ""){
            isValid = false;  
          }
        }
        if (this.dureeTitleTarget.classList.contains('select_inactive') == false && this.dureeTarget.value == ""){
          isValid = false;
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

    change(event){
      event.preventDefault();
      this.errorCorpsTarget.classList.add('visually-hidden');
      this.error2Target.classList.add('visually-hidden');
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
          const dates = [parseInt(this.date1Target.value), parseInt(this.date2Target.value), parseInt(this.date3Target.value), parseInt(this.debutf1Target.value),parseInt(this.debutf2Target.value),parseInt(this.debutf3Target.value),parseInt(this.debutf4Target.value),parseInt(this.debutf5Target.value),parseInt(this.debutf6Target.value), parseInt(this.debutProjetTarget.value), parseInt(this.finProjetTarget.value)];
          let date_invalid = true;
          let projet_invalid = true;
          let emploi_invalid = true;

          dates.forEach((date) => {
            if (date >= 2022+67-age){
              date_invalid = false;
            }
          })

          //dates d emploi fonctionnel + promotions de grades 
          const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
          const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
          const promo_targets = [this.date1Target, this.date2Target,this.date3Target];
          if (this.debutProjetTarget.value != "" && this.finProjetTarget.value != ''){
            //ef interdit pdt dispo
            [0,1,2,3,4,5].forEach((indice)=>{
              if (debut_targets[indice].value != '' && duree_targets[indice].value  != '' ){
                if ( ( parseInt(this.debutProjetTarget.value) <= parseInt(debut_targets[indice].value) && parseInt(debut_targets[indice].value) <= parseInt(this.finProjetTarget.value)) || ( parseInt(debut_targets[indice].value)  <= parseInt(this.debutProjetTarget.value) && parseInt(this.debutProjetTarget.value) <= parseInt(debut_targets[indice].value) +parseInt(duree_targets[indice].value) ) || (parseInt(debut_targets[indice].value)  <= parseInt(this.finProjetTarget.value) && parseInt(this.finProjetTarget.value) <= parseInt(debut_targets[indice].value) +parseInt(duree_targets[indice].value)) ){
                  projet_invalid = false;
                }
              }
            });
            if (this.finfEchelonTarget.value != ""){
              if (parseInt(this.debutProjetTarget.value) <= parseInt(this.finfEchelonTarget.value)){
                projet_invalid = false;
              }
            };
            //promo interdite pdt dispo
            [0,1,2].forEach((indice)=>{            
              if (promo_targets[indice].value != ""){
                if ((parseInt(this.debutProjetTarget.value) <= parseInt(promo_targets[indice].value)) &&  (parseInt(promo_targets[indice].value)<= parseInt(this.finProjetTarget.value))){
                  projet_invalid = false;      
                }
              }
            })
          }
          if (this.finfEchelonTarget.value != ""){
            if (67-age <= this.finfEchelonTarget.value-2022){
              emploi_invalid = false
            }
          }


          if (date_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates renseignées sont incompatibles avec l'âge renseigné";
          } else if (projet_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates d'un projet de disponibilité ne peuvent pas correspondre à des dates d'occupation d'un emploi fonctionnel ni de promotions de grade";
          }else if (emploi_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "La date de fin d'un emploi fonctionnel doit être inférieure à la durée de votre carrière";
          
          }else {
            this.errorCorpsTarget.classList.add('visually-hidden');
            // on eleve tous les forms
            const form_targets = [this.ageTarget,this.corpsTarget,this.gradeTarget,this.echelonTarget,this.dureeTarget,this.date1Target,this.date2Target,this.date3Target,this.debutProjetTarget, this.finProjetTarget,
            this.emploifTarget,this.emploifEchelonTarget,this.dureefEchelonTarget,this.finfEchelonTarget,this.debutfEmploiTarget];
            const result_targets = [this.resultAgeTarget,this.resultCorpsTarget,this.resultGradeTarget,this.resultEchelonTarget,this.resultDureeTarget,this.resultdate1Target,this.resultdate2Target,this.resultdate3Target,this.resultdebutProjetTarget, this.resultfinProjetTarget,
            this.resultEmploifTarget, this.resultEchelonfTarget,this.resultDureefTarget,this.resultFinfTarget,this.resultDebutfTarget];
            
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].forEach((indice)=>{
              form_targets[indice].classList.add('visually-hidden');
              result_targets[indice].classList.remove('visually-hidden');
              if (form_targets[indice].value == ""){
                result_targets[indice].innerHTML = '-';
              }else{
                result_targets[indice].innerHTML = form_targets[indice].value;
              }
            })
            this.boutonDispoTarget.classList.remove('visually-hidden');
            this.boutonSituationTarget.classList.remove('visually-hidden');
            this.boutonEditTarget.classList.remove('visually-hidden');

            if (this.contentdispoTarget.classList.contains('visually-hidden')){
              this.boutonDispoTarget.classList.add('visually-hidden');
              this.finProjetTarget.classList.remove('visually-hidden');
              this.debutProjetTarget.classList.remove('visually-hidden');
              this.resultfinProjetTarget.classList.add('visually-hidden');
              this.resultdebutProjetTarget.classList.add('visually-hidden');
            }else if (this.finProjetTarget.value == ''){
              this.contentdispoTarget.classList.add('visually-hidden');
              this.boutonprojetTarget.classList.remove('visually-hidden');
              this.debutProjetTarget.selectedIndex =0;
              this.finProjetTarget.selectedIndex =0;
            }

            const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
            const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
            const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
            const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
            const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
            const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
            const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];
            //const trash_targets = [this.trash1Target,this.trash2Target,this.trash3Target,this.trash4Target,this.trash5Target,this.trash6Target];
    
            [5,4,3,2,1,0].forEach((indice)=>{
              if (content_targets[indice].classList.contains('visually-hidden') == false){
                if (emploif_targets[indice].value != ''){
                emploif_targets[indice].classList.add('visually-hidden');
                debut_targets[indice].classList.add('visually-hidden');
                duree_targets[indice].classList.add('visually-hidden');
                //trash_targets[indice].classList.add('visually-hidden');
                result_emploif_targets[indice].classList.remove('visually-hidden');
                result_debut_targets[indice].classList.remove('visually-hidden');
                result_duree_targets[indice].classList.remove('visually-hidden');
                result_emploif_targets[indice].innerHTML = emploif_targets[indice].value;
                result_debut_targets[indice].innerHTML = debut_targets[indice].value;
                result_duree_targets[indice].innerHTML = duree_targets[indice].value;
              }
              }
            })
          } 
        
        }
    }

    reset_dispo(event){
      event.preventDefault();
      this.boutonDispoTarget.classList.add('visually-hidden');
      const form_targets = [this.debutProjetTarget, this.finProjetTarget];
      const result_targets = [this.resultdebutProjetTarget, this.resultfinProjetTarget];
      [0,1].forEach((indice)=>{
          form_targets[indice].classList.remove('visually-hidden');
          result_targets[indice].classList.add('visually-hidden');
      })
    }

    reset_situation(event){
      event.preventDefault();
      this.boutonSituationTarget.classList.add('visually-hidden');
      
      const form_targets = [this.ageTarget,this.corpsTarget,this.gradeTarget,this.echelonTarget,this.dureeTarget,this.date1Target,this.date2Target,this.date3Target];
      const result_targets = [this.resultAgeTarget,this.resultCorpsTarget,this.resultGradeTarget,this.resultEchelonTarget,this.resultDureeTarget,this.resultdate1Target,this.resultdate2Target,this.resultdate3Target];
      [0,1,2,3,4,5,6,7].forEach((indice)=>{
          form_targets[indice].classList.remove('visually-hidden');
          result_targets[indice].classList.add('visually-hidden');
      })
    }

}
