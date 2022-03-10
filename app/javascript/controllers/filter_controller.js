import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static targets = [ 'form','submitBouton', "grade2", "grade3", "grade4",'grade2Title','grade3Title','grade4Title',
     'emploif','emploifEchelon','dureefEchelon','finfEchelon','debutfEmploi',
    
     "error","EditEF",
     
    "resultEmploif","resultEchelonf","resultDureef","resultFinf","resultDebutf","boutonEdit",
    'errorCorps','age','resultdate1','resultdate2','resultdate3',
    "emploif1","emploif2","emploif3","emploif4","emploif5","emploif6",
      "debutf1","debutf2","debutf3","debutf4","debutf5","debutf6",
      "dureef1","dureef2","dureef3","dureef4","dureef5","dureef6",
      "resultEmploif1","resultEmploif2","resultEmploif3","resultEmploif4","resultEmploif5","resultEmploif6",
      "resultDebutf1","resultDebutf2","resultDebutf3","resultDebutf4","resultDebutf5","resultDebutf6",
      "resultDureef1","resultDureef2","resultDureef3","resultDureef4","resultDureef5","resultDureef6",
      'debutProjet','finProjet', 'resultdebutProjet', 'resultfinProjet', 'boutonDispo','contentdispo','boutonprojet',
      ,'corps','grade','echelon','duree','dureeTitle','dureeTitle2',
      'resultAge','resultCorps','resultGrade','resultEchelon','resultDuree','boutonSituation',
      "content1","content2","content3","content4","content5","content6",'error2'];

  	connect() {    
        this.filters =  { corps: [], grades: [], echelons: [],grade2: [],grade3: [],
         emploif: [], echelonf: [], }
        
  	}

    corpsChange(event) {
        this.filters.corps = getSelectedValues(event)
        this.filters.grades = []
        // on remet les projection a 0
        this.grade2TitleTarget.classList.add("select_inactive")
        this.grade3TitleTarget.classList.add("select_inactive")
        this.grade4TitleTarget.classList.add("select_inactive")
        this.dureeTitleTarget.classList.remove("select_inactive");
        
        const grades = [this.grade2Target,this.grade3Target,this.grade4Target];
        [0,1,2].forEach((indice)=>{
            grades[indice].innerHTML = "";
        })
        
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.change()
    }

    gradesChange(event) {
        this.filters.grades = getSelectedValues(event)
        this.filters.echelons = []
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.dureeTitleTarget.classList.remove("select_inactive");
        this.change2()
    }

    echelonsChange(event) {
        this.filters.echelons = getSelectedValues(event)
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.change3()
    }

    promoGrade2Change(event){
        this.filters.grade2 = getSelectedValues(event);
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.filters.grade3 = [];
        this.filters.grade4 = [];

        this.changePromoGrade2()
      
    }

    promoGrade3Change(event){
        this.filters.grade3 = getSelectedValues(event);
        this.filters.grade4 = [];
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.changePromoGrade3()
    }


    change() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(this.data.get("url"), { 
          method: 'POST', 
          body: JSON.stringify( this.filters ),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
        //this.form.innerHTML = html
        this.updateGrades(data)
        });
        
    }

    change2() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(this.data.get("url"), { 
          method: 'POST', 
          body: JSON.stringify( this.filters ),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
        //this.form.innerHTML = html
        this.updateEchelons(data),this.updatePromotions(data)
        })
    }

    change3() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(this.data.get("url"), { 
          method: 'POST', 
          body: JSON.stringify( this.filters ),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
        //this.form.innerHTML = html
        this.updateDurees(data)
        })
    }
   
    changePromoGrade2() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(this.data.get("url"), { 
          method: 'POST', 
          body: JSON.stringify( this.filters ),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
        //this.form.innerHTML = html
        this.updatePromoGrades2(data)
        })
    }

    changePromoGrade3() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(this.data.get("url"), { 
          method: 'POST', 
          body: JSON.stringify( this.filters ),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
        //this.form.innerHTML = html
        this.updatePromoGrades3(data)
        })
    }

    
    updateGrades(data){
        this.gradeTarget.innerHTML = "";
        
        this.dureeTarget.innerHTML = "";
        this.echelonTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.gradeTarget.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = "";
        option2.innerHTML = "- Selectionner -";
        this.echelonTarget.appendChild(option2);

        const option3 = document.createElement("option");
        option3.value = "";
        option3.innerHTML = "- Selectionner -";
        this.dureeTarget.appendChild(option3);

        const nom_grades = data.nom_grades;

        data.grades.forEach((grade,index) => {
            const option = document.createElement("option");
            option.value = grade;
            //option.innerHTML = "Grade " + grade;
            option.innerHTML = grade + ' - ' + nom_grades[index];
            this.gradeTarget.appendChild(option);
        })
    }

    updateEchelons(data){
        this.echelonTarget.innerHTML = "";
        this.dureeTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.echelonTarget.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = "";
        option2.innerHTML = "- Selectionner -";
        this.dureeTarget.appendChild(option2);

        data.echelons.forEach((echelon) => {
            const option = document.createElement("option");
            option.value = echelon;
            option.innerHTML = echelon;
            this.echelonTarget.appendChild(option);
        })
    }

    updateDurees(data){
        this.dureeTarget.innerHTML = "";
        if (data.durees.length != 0){
            this.dureeTitleTarget.classList.remove("select_inactive");
            const option = document.createElement("option");
            option.value = "";
            option.innerHTML = "- Selectionner -";
            this.dureeTarget.appendChild(option);
        data.durees.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;
            option.innerHTML = duree ;       
            this.dureeTarget.appendChild(option);
        })
        }else{
            this.dureeTitleTarget.classList.add("select_inactive");
        }
        this.validateForm();

    }

    updatePromotions(data){
        var grade = parseInt(data.grades);
        var max_grade = parseInt(data.max_grade);
        const grades = [this.grade2Target,this.grade3Target,this.grade4Target];
        const grades_title = [this.grade2TitleTarget, this.grade3TitleTarget,this.grade4TitleTarget]
        // grades à dégriser 
        const max_arr = Array.from({length:(max_grade-grade)},(v,k)=>k+grade+1);  

        [1,2,3].forEach((indice)=> {
            grades[indice-1].innerHTML = "";
            grades_title[indice-1].classList.add("select_inactive");
            if (grade == indice && max_grade > grade){
                const option = document.createElement("option");
                option.value = "";
                option.innerHTML = "- Selectionner -";
                grades[indice-1].appendChild(option);
                data.array.forEach((ar) => {
                    const option = document.createElement("option");
                    option.value = ar;
                    option.innerHTML = ar;
                    grades[indice-1].appendChild(option);
                })
            }
        })

        max_arr.forEach((indice) => {
            grades_title[indice-2].classList.remove("select_inactive");
            if (grades[indice-2].innerHTML == ""){
                const option2 = document.createElement("option");
                option2.value = "";
                option2.innerHTML = "- Selectionner -";
                grades[indice-2].appendChild(option2);
            }
        });
        
    }

    updatePromoGrades2(data){
        const max_grade = data.max_grade;
        this.grade3Target.innerHTML = "";
        this.grade4Target.innerHTML = "";
        if (max_grade > 2){
            const option = document.createElement("option");
            option.value = "";
            option.innerHTML = "- Selectionner -";

            this.grade3Target.appendChild(option);
            if (max_grade == 4){
                const option2 = document.createElement("option");
                option2.value = "";
                option2.innerHTML = "- Selectionner -";
                this.grade4Target.appendChild(option2);
            }
            if (data.array_grade3 != null){
                data.array_grade3.forEach((ar) => {
                const option = document.createElement("option");
                option.value = ar;
                option.innerHTML = ar;
                this.grade3Target.appendChild(option);
                })
            }
        }
    }

    updatePromoGrades3(data){
        const max_grade = data.max_grade;
        this.grade4Target.innerHTML = "";
        if (max_grade > 3){
            const option = document.createElement("option");
            option.value = "";
            option.innerHTML = "- Selectionner -";
            this.grade4Target.appendChild(option);
            
            data.array_grade4.forEach((ar) => {
            const option = document.createElement("option");
            option.value = ar;
            option.innerHTML = ar;
            this.grade4Target.appendChild(option);
            })
        }
    }

    // emplois fonctionnels

    emploifChange(event){
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.dureeTitle2Target.classList.remove("select_inactive");
        this.filters.emploif = getSelectedValues(event);
        this.filters.echelonf = [];
        
        const form_targets = [this.emploifEchelonTarget,this.dureefEchelonTarget, this.finfEchelonTarget, this.debutfEmploiTarget];
        const result_targets = [this.resultEchelonfTarget, this.resultDureefTarget, this.resultFinfTarget, this.resultDebutfTarget];
        
        if (this.filters.emploif == "Aucun") {
            // on supp les formulaires dapres
            [0,1,2,3].forEach((indice) => {
                form_targets[indice].classList.add('visually-hidden');
                form_targets[indice].selectedIndex = 0;
                result_targets[indice].classList.remove('visually-hidden');
                result_targets[indice].innerHTML = "-";
            });


        } else {
            [0,1,2,3].forEach((indice) => {
                form_targets[indice].classList.remove('visually-hidden');
                result_targets[indice].classList.add('visually-hidden');
            });
            this.changeEchelon()
        }
        
    }

    echelonfChange(event){
        this.filters.echelonf = getSelectedValues(event)  
       
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.changeDatesf()

    }

    dureefChange(event){
        this.errorCorpsTarget.classList.add('visually-hidden');   
    }

    debutfChange(event){
        this.errorCorpsTarget.classList.add('visually-hidden');  

        const annee = getSelectedValues(event) 
        const array = Array.from({length:6-annee},(v,k)=>k+2023);
        this.finfEchelonTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.finfEchelonTarget.appendChild(option);
        if ( annee != ""){
            array.forEach((duree) => {
                const option = document.createElement("option");
                option.value = duree;
                option.innerHTML = duree;
                this.finfEchelonTarget.appendChild(option);
            })
        }
    }


    changeEchelon() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(this.data.get("url"), { 
          method: 'POST', 
          body: JSON.stringify( this.filters ),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
        //this.form.innerHTML = html
        this.updateEf(data)
        })
    }

    changeDatesf() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(this.data.get("url"), { 
          method: 'POST', 
          body: JSON.stringify( this.filters ),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
        //this.form.innerHTML = html
        this.updateDatesf(data)
        })
    }
 

    updateEf(data){
        this.emploifEchelonTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.emploifEchelonTarget.appendChild(option);

        this.dureefEchelonTarget.innerHTML = "";
        const option2 = document.createElement("option");
            option2.value = "";
            option2.innerHTML = "- Selectionner -";
            this.dureefEchelonTarget.appendChild(option2);

        this.finfEchelonTarget.innerHTML = "";
        const option3 = document.createElement("option");
            option3.value = "";
            option3.innerHTML = "- Selectionner -";
            this.finfEchelonTarget.appendChild(option3);

        this.debutfEmploiTarget.selectedIndex = 0;

        data.echelonsf.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;
            option.innerHTML = duree;
            this.emploifEchelonTarget.appendChild(option);
        })
    }

    updateDatesf(data){
        this.dureefEchelonTarget.innerHTML = "";
        if (data.dureef.length != 0){
            this.dureeTitle2Target.classList.remove("select_inactive");
            const option = document.createElement("option");
            option.value = "";
            option.innerHTML = "- Selectionner -";
            this.dureefEchelonTarget.appendChild(option);

        data.dureef.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;      
            option.innerHTML = duree ;  
            this.dureefEchelonTarget.appendChild(option);
        })
        }else{
            this.dureeTitle2Target.classList.add("select_inactive");
        }
        this.validateForm();
    }


    
    emploifChange2(event){
        this.errorCorpsTarget.classList.add('visually-hidden');
        var id = event.target.dataset.value;
        const emploi = getSelectedValues(event);

        const dates_arr = Array.from({length:50},(v,k)=>k+2023);
      
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";

        var target ,target2 ;
        //var data_non_dispo = [];
        var nouvelles_dates = [];

        var debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
        var duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
        [1,2,3,4,5,6].forEach( (indice) => {
            if (id == indice) {
            target = debut_targets[indice-1];
            target2 = duree_targets[indice-1];            
            }
        })
        
        if (emploi == "Aucun"){
            target.innerHTML = "";
            target.appendChild(option);
            target2.selectedIndex = 0;
        } else {
            /* recup toutes les dates non dispo d'apres form 
            [1,2,3,4,5,6].forEach( (indice) => {
                if (debut_targets[indice-1].value != "" && debut_targets[indice-1].value != null && duree_targets[indice-1].value != "" && duree_targets[indice-1].value != null){
                data_non_dispo =data_non_dispo.concat(Array.from({length:duree_targets[indice-1].value},(v,k)=> k + parseInt(debut_targets[indice-1].value)));
                }
            })
            const nouvelles_dates2 = dates_arr.filter(date => !data_non_dispo.includes(date));   */       
            if ( id == 1 ){
                //on prend fin emploi fonctionnel actuel si existe 
                if (this.finfEchelonTarget.value != null && this.finfEchelonTarget.value != "" && this.finfEchelonTarget.value != undefined){
                    nouvelles_dates = dates_arr.filter(date => date > parseInt(this.finfEchelonTarget.value));
                   
                } else {
                    nouvelles_dates = dates_arr; 
                }
            }
            if ( id > 1 ){
                if (debut_targets[id-2].value != null && debut_targets[id-2].value != "" && duree_targets[id-2].value != null && duree_targets[id-2].value != ""){
                nouvelles_dates = dates_arr.filter(date => date >= parseInt(debut_targets[id-2].value)+parseInt(duree_targets[id-2].value));
                }
                
            } 
            target.innerHTML = "";
            target.appendChild(option);
            target2.selectedIndex = 0;
            nouvelles_dates.forEach((date) => {
                const option3 = document.createElement("option");
                option3.value = date;
                option3.innerHTML = date;
                target.appendChild(option3);
            })

        }
    }
    
    projetChange(event){
        const debut = getSelectedValues(event);
        this.finProjetTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.finProjetTarget.appendChild(option);
        if (debut != ''){
        const dates = Array.from({length:(2072-parseInt(debut))},(v,k)=>k+parseInt(debut)+1);
        dates.forEach((date)=>{
            const option = document.createElement("option");
            option.value = date;
            option.innerHTML = date;
            this.finProjetTarget.appendChild(option);
        })
        }
    } 


    //validation

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

    change_form(event){
      event.preventDefault();
      this.errorCorpsTarget.classList.add('visually-hidden');
      this.error2Target.classList.add('visually-hidden');
      this.errorTarget.classList.add('visually-hidden');
     
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
          const dates = [parseInt(this.grade2Target.value), parseInt(this.grade3Target.value), parseInt(this.grade4Target.value), parseInt(this.debutf1Target.value),parseInt(this.debutf2Target.value),parseInt(this.debutf3Target.value),parseInt(this.debutf4Target.value),parseInt(this.debutf5Target.value),parseInt(this.debutf6Target.value), parseInt(this.debutProjetTarget.value), parseInt(this.finProjetTarget.value)];
          let date_invalid = true;
          let projet_invalid = true;
          let emploi_invalid = true;
          let dates_ef_invalid = true;

          dates.forEach((date) => {
            if (date >= 2022+67-age){
              date_invalid = false;
            }
          })

          //dates d emploi fonctionnel + promotions de grades 
          const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
          const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
          const promo_targets = [this.grade2Target, this.grade3Target,this.grade4Target];
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
            if (67-age <= this.finfEchelonTarget.value-2022+1){
              emploi_invalid = false
            }
          }
          //verifie date croissante des ef 
          [0,1,2,3,4].forEach((indice)=>{
            if (debut_targets[indice+1].value != ''){
                if (parseInt(debut_targets[indice].value) + parseInt(duree_targets[indice].value) > parseInt(debut_targets[indice+1].value)){
                    dates_ef_invalid = false
                }
            }
          })
          if (debut_targets[0].value != '' && this.finfEchelonTarget.value !=''){
            if (parseInt(this.finfEchelonTarget.value) >= parseInt(debut_targets[0].value)){
                dates_ef_invalid = false
            }
          }


          if (date_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates renseignées sont incompatibles avec l'âge renseigné.";
          } else if (projet_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates d'un projet de disponibilité ne peuvent pas correspondre à des dates d'occupation d'un emploi fonctionnel ni de promotions de grade.";
          }else if (emploi_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "La date de fin d'un emploi fonctionnel doit être inférieure à la durée de votre carrière.";
          
          }else if (dates_ef_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('visually-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates et durées de projections d'emplois fonctionnels doivent suivre un ordre croissant et ne peuvent pas se recouper.";
          
          
          }else {
            this.errorCorpsTarget.classList.add('visually-hidden');
            // on eleve tous les forms
            const form_targets = [this.ageTarget,this.corpsTarget,this.gradeTarget,this.echelonTarget,this.dureeTarget,this.grade2Target,this.grade3Target,this.grade4Target,this.debutProjetTarget, this.finProjetTarget,
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

            this.EditEFTarget.classList.remove('visually-hidden');
            const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
            const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
            const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
            const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
            const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
            const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
            const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];
          
            [5,4,3,2,1,0].forEach((indice)=>{
              if (content_targets[indice].classList.contains('visually-hidden') == false){
                if (emploif_targets[indice].value != ''){
                emploif_targets[indice].classList.add('visually-hidden');
                debut_targets[indice].classList.add('visually-hidden');
                duree_targets[indice].classList.add('visually-hidden');
                result_emploif_targets[indice].classList.remove('visually-hidden');
                result_debut_targets[indice].classList.remove('visually-hidden');
                result_duree_targets[indice].classList.remove('visually-hidden');
                result_emploif_targets[indice].innerHTML = emploif_targets[indice].value;
                result_debut_targets[indice].innerHTML = debut_targets[indice].value;
                result_duree_targets[indice].innerHTML = duree_targets[indice].value + " ans";
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
      
      const form_targets = [this.ageTarget,this.corpsTarget,this.gradeTarget,this.echelonTarget,this.dureeTarget,this.grade2Target,this.grade3Target,this.grade4Target];
      const result_targets = [this.resultAgeTarget,this.resultCorpsTarget,this.resultGradeTarget,this.resultEchelonTarget,this.resultDureeTarget,this.resultdate1Target,this.resultdate2Target,this.resultdate3Target];
      [0,1,2,3,4,5,6,7].forEach((indice)=>{
          form_targets[indice].classList.remove('visually-hidden');
          result_targets[indice].classList.add('visually-hidden');
      })
    }

    reset(e){
        const result_emploi_f = [this.resultEmploifTarget, this.resultEchelonfTarget,this.resultDureefTarget,this.resultFinfTarget,this.resultDebutfTarget]
        const emploi_f = [this.emploifTarget,this.emploifEchelonTarget, this.dureefEchelonTarget, this.finfEchelonTarget, this.debutfEmploiTarget];

        this.boutonEditTarget.classList.add('visually-hidden');
        this.errorTarget.classList.add('visually-hidden');
        this.errorCorpsTarget.classList.add('visually-hidden');

        // on remet champ emploi 
        emploi_f[0].classList.remove('visually-hidden');
        result_emploi_f[0].classList.add('visually-hidden');
        if (emploi_f[0].value != "Aucun"){
        [1,2,3,4].forEach((indice) => {
              emploi_f[indice].classList.remove('visually-hidden');
              result_emploi_f[indice].classList.add('visually-hidden');    
          });
        }

        e.preventDefault();
      }

    editEf(e){
        e.preventDefault();

        const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
        const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
        const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
        const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
        const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
        const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];

        [0,1,2,3,4,5].forEach((indice)=> {
            emploif_targets[indice].classList.remove('visually-hidden');
            debut_targets[indice].classList.remove('visually-hidden');
            duree_targets[indice].classList.remove('visually-hidden');
            result_emploif_targets[indice].classList.add('visually-hidden');
            result_debut_targets[indice].classList.add('visually-hidden');
            result_duree_targets[indice].classList.add('visually-hidden');
        })
    
    }

}

function getSelectedValues(event) {
        return [...event.target.selectedOptions].map(option => option.value)
    }