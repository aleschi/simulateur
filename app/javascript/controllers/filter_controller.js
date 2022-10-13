import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static get targets() {
  return [
    'form','submitBouton','boutonSituation','errorCorps','errorSituation',
    'formSituation','age','corps','grade','echelon','duree',
    'resultSituation','resultAge','resultCorps','resultGrade','resultEchelon','resultDuree',
    
    'contentToggleEmploi','radioButton','resultToggleEmploi','formEmploi','emploif','niveauEf','echelonEf','dureeEchelonEf','finEf', 'dureeEchelonEfTitle', 'echelonEfTitle',
    "resultSituationEmploi","resultEmploif","resultNiveauEf","resultEchelonEf","resultDureeEchelonEf","resultFinEf",

    "error", "buttonDeleteEF",    
    "content1","content2","content3","content4","content5","content6", "bouton",
    "emploif1","emploif2","emploif3","emploif4","emploif5","emploif6",
    "niveauEf1","niveauEf2","niveauEf3","niveauEf4","niveauEf5","niveauEf6",
    "debutEf1","debutEf2","debutEf3","debutEf4","debutEf5","debutEf6",
    "dureeEf1","dureeEf2","dureeEf3","dureeEf4","dureeEf5","dureeEf6",
    "resultShowEmploif1","resultShowEmploif2","resultShowEmploif3","resultShowEmploif4","resultShowEmploif5","resultShowEmploif6",
    "resultEmploif1","resultEmploif2","resultEmploif3","resultEmploif4","resultEmploif5","resultEmploif6",
    "resultDebutEf1","resultDebutEf2","resultDebutEf3","resultDebutEf4","resultDebutEf5","resultDebutEf6",
    "resultDureeEf1","resultDureeEf2","resultDureeEf3","resultDureeEf4","resultDureeEf5","resultDureeEf6",
    "resultNiveauEf1","resultNiveauEf2","resultNiveauEf3","resultNiveauEf4","resultNiveauEf5","resultNiveauEf6",
    "removeEf1","removeEf2","removeEf3","removeEf4","removeEf5","removeEf6",
    'resultDispo','resultdebutProjet', 'resultfinProjet','buttonNewProjet','contentdispo','debutProjet','finProjet','buttonDeleteDispo',
    "grade2", "grade3", "grade4",'grade2Title','grade3Title','grade4Title',"contentgrades","buttonNewGrades",'buttonDeleteGrades','formGrades',
    'resultGrade2','resultGrade3','resultGrade4', 'resultShowGrade2','resultShowGrade3','resultShowGrade4',     
     
    'buttonSimulation','resultSimulation','resultToggleSimulation', 'radioButtonSimulation','contentToggleSimulation','formSimulation',
    'graphe','table',];
}
  	connect() {   
        this.filters =  { corps: [], grades: [], echelons: [],grade2: [],grade3: [],
         emploif: [], echelonf: [], };
        this.toggleEmploi();
        this.toggleSimulation();
  	}

    corpsChange(event) {
        this.filters.corps = getSelectedValues(event)
        this.filters.grades = []
        this.errorCorpsTarget.classList.add('fr-hidden');
        // on remet les projection a 0
        this.resetChamp(this.gradeTarget);
        this.resetChamp(this.echelonTarget);
        this.resetChamp(this.dureeTarget);

        const grades = [this.grade2Target,this.grade3Target,this.grade4Target];
        [0,1,2].forEach((indice)=>{
            grades[indice].innerHTML = "";
        })
        this.formGradesTarget.classList.add('fr-hidden');
        this.contentgradesTarget.classList.add('fr-hidden');
        this.buttonDeleteGradesTarget.classList.add('fr-hidden');
        
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
        this.updateGrades(data)
        });
    }
    updateGrades(data){       
        const nom_grades = data.nom_grades;
        if (data.grades != null){
            data.grades.forEach((grade,index) => {
                const option = document.createElement("option");
                option.value = grade;
                option.innerHTML = grade + ' - ' + nom_grades[index];
                this.gradeTarget.appendChild(option);
            })
        }

        this.validateForm();
    }

    gradesChange(event) {
        this.filters.grades = getSelectedValues(event)
        this.filters.echelons = []
        this.errorCorpsTarget.classList.add('fr-hidden');
        this.resetChamp(this.echelonTarget);
        this.resetChamp(this.dureeTarget);
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
        this.updateEchelons(data),this.updatePromotions(data)
        })
    }
    updateEchelons(data){
        if (data.echelons != null){
            data.echelons.forEach((echelon) => {
                const option = document.createElement("option");
                option.value = echelon;
                option.innerHTML = echelon;
                this.echelonTarget.appendChild(option);
            })
        }

        this.validateForm();
    }
    updatePromotions(data){
        var grade = parseInt(data.grades);
        var max_grade = parseInt(data.max_grade);
        const grades = [this.grade2Target,this.grade3Target,this.grade4Target];
        const grades_title = [this.grade2TitleTarget, this.grade3TitleTarget,this.grade4TitleTarget];
        const grades_results = [this.resultGrade2Target, this.resultGrade3Target,this.resultGrade4Target];
        
        const max_arr = Array.from({length:(max_grade-grade)},(v,k)=>k+grade+1);  
        if (grade == max_grade){ // choisi le grade max on ne propose plus dans les simu futures
            this.formGradesTarget.classList.add('fr-hidden');
            this.contentgradesTarget.classList.add('fr-hidden');
            this.buttonDeleteGradesTarget.classList.add('fr-hidden');
        }else{
            if(this.contentgradesTarget.classList.contains('fr-hidden')){
                this.buttonNewGradesTarget.classList.remove('fr-hidden');
                this.formGradesTarget.classList.remove('fr-hidden');
            }
            [1,2,3].forEach((indice)=> {
                grades_results[indice-1].classList.add('fr-hidden'); // grades à dégriser si modifie grade apres 1er validation 
                grades[indice-1].classList.remove('fr-hidden');
                grades[indice-1].innerHTML = "";
                grades_title[indice-1].classList.add("select_inactive");
                grades[indice-1].disabled = true ; // on grise par defaut et on degrise pour les promo de grade sup au grade 
                if (grade == indice){
                    this.resetChamp(grades[indice-1]);               
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
                grades[indice-2].disabled = false ;
                if (grades[indice-2].innerHTML == ""){
                    this.resetChamp(grades[indice-2]); //on degrise les grade sup à la 1ere option de promo de grade possible mais pas de date dedans
                }
            });
        }
        
    }

    echelonsChange(event) {
        this.filters.echelons = getSelectedValues(event)
        this.errorCorpsTarget.classList.add('fr-hidden');
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
        this.updateDurees(data)
        })
    }
    updateDurees(data){
        this.resetChamp(this.dureeTarget);

        if (data.durees != null){
            data.durees.forEach((duree) => {
                const option = document.createElement("option");
                option.value = duree;
                option.innerHTML = (duree-1) + " mois";       
                this.dureeTarget.appendChild(option);
            })
        }
        this.validateForm();

    }

    promoGrade2Change(event){
        this.filters.grade2 = getSelectedValues(event);
        this.errorCorpsTarget.classList.add('fr-hidden');
        this.filters.grade3 = [];
        this.filters.grade4 = [];

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
        this.updatePromoGrades2(data)
        })
      
    }
    updatePromoGrades2(data){
        const max_grade = data.max_grade;
        if (max_grade > 2){
            this.resetChamp(this.grade3Target);
            if (max_grade == 4){
                this.resetChamp(this.grade4Target);
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
    promoGrade3Change(event){
        this.filters.grade3 = getSelectedValues(event);
        this.filters.grade4 = [];
        this.errorCorpsTarget.classList.add('fr-hidden');
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
        this.updatePromoGrades3(data)
        })
    } 

    updatePromoGrades3(data){
        const max_grade = data.max_grade;
        if (max_grade > 3){
            this.resetChamp(this.grade4Target);
            
            data.array_grade4.forEach((ar) => {
            const option = document.createElement("option");
            option.value = ar;
            option.innerHTML = ar;
            this.grade4Target.appendChild(option);
            })
        }
    }

    // change emploi fonctionnel actuel
    emploifChange(event){
        this.errorCorpsTarget.classList.add('fr-hidden');
        this.dureeEchelonEfTitleTarget.classList.remove("select_inactive");
        this.filters.emploif = getSelectedValues(event);
        this.filters.echelonf = [];
        
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
        this.updateEf(data)
        })   


        this.validateForm();
        
    }

    updateEf(data){
        // on reset les champs     
        this.resetChamp(this.niveauEfTarget);
        this.resetChamp(this.echelonEfTarget);
        this.resetChamp(this.dureeEchelonEfTarget);       
        this.finEfTarget.selectedIndex = 0;
        this.echelonEfTitleTarget.classList.remove("select_inactive");
        this.echelonEfTarget.disabled = false;
        this.dureeEchelonEfTitleTarget.classList.remove("select_inactive");
        this.dureeEchelonEfTarget.disabled = false;
        if (data.niveauEf != null){
            data.niveauEf.forEach((niveau) => {
                const opt = document.createElement("option");
                opt.value = niveau;
                opt.innerHTML = "Niveau "+ niveau;
                this.niveauEfTarget.appendChild(opt);
            })
        }
        if (data.echelonsf != null){
            if (data.echelonsf.length != 0){              
                data.echelonsf.forEach((echelon) => {
                    const option = document.createElement("option");
                    option.value = echelon;
                    option.innerHTML = echelon;
                    this.echelonEfTarget.appendChild(option);
                })
            } else {
                this.echelonEfTitleTarget.classList.add("select_inactive");
                this.echelonEfTarget.disabled = true;
                this.dureeEchelonEfTitleTarget.classList.add("select_inactive");
                this.dureeEchelonEfTarget.disabled = true;
            }
        }
        this.validateForm();
    }


    echelonfChange(event){
        this.filters.echelonf = getSelectedValues(event)         
        this.errorCorpsTarget.classList.add('fr-hidden');
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
        this.updateDatesf(data)
        })

    }

    updateDatesf(data){
        this.resetChamp(this.dureeEchelonEfTarget);

        if (data.dureeEf != null){
            data.dureeEf.forEach((duree) => {
                const option = document.createElement("option");
                option.value = duree;      
                option.innerHTML = (duree-1) + " mois";  
                this.dureeEchelonEfTarget.appendChild(option);
            })
        }

        this.validateForm();
    }

 
   
    emploifChange2(event){
        this.errorCorpsTarget.classList.add('fr-hidden');
        var id = event.target.dataset.value; //numero ef 
        const emploi = getSelectedValues(event);
  
        var debut_targets = [this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target];
        var duree_targets = [this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target];
        var niveau_targets = [this.niveauEf1Target, this.niveauEf2Target, this.niveauEf3Target, this.niveauEf4Target, this.niveauEf5Target, this.niveauEf6Target]
        
        
        this.resetChamp(niveau_targets[id-1]);    
        // mettre à jour les niveaux  
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const url = "/select_niveau";
        const body = { emploi }
        fetch(url, { 
          method: 'POST', 
          body: JSON.stringify(body),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
            data.niveauEf.forEach((niveau) => {
            const opt = document.createElement("option");
            opt.value = niveau;
            opt.innerHTML = "Niveau "+ niveau;
            niveau_targets[id-1].appendChild(opt);
            })
        })  

        this.resetChamp(debut_targets[id-1]);
        duree_targets[id-1].selectedIndex = 0; //reset durée
        // adapter les options pour les débuts en fonction des précedents ef 
        var dates_arr = Array.from({length:50},(v,k)=>k+2024);
        if ( id == 1 ){
            //on prend fin emploi fonctionnel actuel si existe 
            if (this.finEfTarget.value != null && this.finEfTarget.value != "" && this.finEfTarget.value != undefined){
                dates_arr = dates_arr.filter(date => date >= parseInt(this.finEfTarget.value));              
            }
        }
        if ( id > 1 ){
            if (debut_targets[id-2].value != null && debut_targets[id-2].value != "" && duree_targets[id-2].value != null && duree_targets[id-2].value != ""){
            dates_arr = dates_arr.filter(date => date >= parseInt(debut_targets[id-2].value)+parseInt(duree_targets[id-2].value));
            }    
        } 
        
        dates_arr.forEach((date) => {
            const option3 = document.createElement("option");
            option3.value = date;
            option3.innerHTML = date;
            debut_targets[id-1].appendChild(option3);
        })

        
        this.validateForm(); 
    }
    
    dispoChange(event){
        const debut = getSelectedValues(event);
        this.resetChamp(this.finProjetTarget);
        if (debut != ''){
        const dates = Array.from({length:(2072-parseInt(debut))},(v,k)=>k+parseInt(debut)+1);
        dates.forEach((date)=>{
            const option = document.createElement("option");
            option.value = date;
            option.innerHTML = date;
            this.finProjetTarget.appendChild(option);
        })
        }
        this.validateForm(); 
    } 

    resetChamp(target){
        target.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- sélectionner -";
        target.appendChild(option);
    }

    validateForm() {
        this.errorCorpsTarget.classList.add('fr-hidden');
        let isValid = true;

        // Tell the browser to find any required fields
        let requiredFieldSelectors = 'select:required';
        let requiredFields = this.formTarget.querySelectorAll(requiredFieldSelectors);
        let selectFields = this.formTarget.querySelectorAll('select');

        selectFields.forEach((field) => {
            field.classList.remove('fr-select--error');
            field.parentNode.classList.remove('fr-select-group--error');
        });

        requiredFields.forEach((field) => {
          // For each required field, check to see if the value is empty
          // if so, we focus the field and set our value to false
          if (!field.disabled && !field.value.trim()) {
            //field.focus();
            isValid = false;

          }
        });


        if (this.radioButtonTarget.checked == true){      
            if (this.emploifTarget.value == "" || this.niveauEfTarget.value == "" || this.finEfTarget.value == ""){
                isValid = false;
            }
            if (this.echelonEfTitleTarget.classList.contains('select_inactive') == false && this.echelonEfTarget.value == ""){
                isValid = false; ;  
            }  
            if (this.dureeEchelonEfTitleTarget.classList.contains('select_inactive') == false && this.dureeEchelonEfTarget.value == ""){
                isValid = false;  
            }
        }

        const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
        const debut_targets = [this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target];
        const duree_targets = [this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target];
        const niveau_targets = [this.niveauEf1Target,this.niveauEf2Target,this.niveauEf3Target,this.niveauEf4Target,this.niveauEf5Target,this.niveauEf6Target];
        [0,1,2,3,4,5].forEach((indice)=>{
          if (emploif_targets[indice].selectedIndex != 0){
            if (debut_targets[indice].selectedIndex == 0 || duree_targets[indice].selectedIndex == 0 || niveau_targets[indice].selectedIndex == 0 ){
              isValid = false;
            }
          }
        })

        if (isValid==true){
            this.submitBoutonTarget.classList.remove("bouton_inactive");
            this.errorCorpsTarget.classList.add('fr-hidden');
        }else{
            this.submitBoutonTarget.classList.add("bouton_inactive")
        }

        return isValid;

    }

    change_form(event){
      event.preventDefault();
      this.errorCorpsTarget.classList.add('fr-hidden');
      this.errorSituationTarget.classList.add('fr-hidden');
      this.errorTarget.classList.add('fr-hidden');
     
    }

    submitForm(event) {

        let isValid = this.validateForm(this.formTarget);
        // If our form is invalid, prevent default on the event so that the form is not submitted
        const required_fields = [this.corpsTarget,this.gradeTarget,this.ageTarget,this.echelonTarget, this.niveauEfTarget];
    
        if (!isValid) {
            // on vérifie les champs requis pour la situation initiale 1/ corps  
            required_fields.forEach((field) => {
                if (!field.disabled && !field.value.trim()) {
                    field.classList.add('fr-select--error');
                    field.parentNode.classList.add('fr-select-group--error');
                }
            })
            // 2/ si ef 
            if (this.radioButtonTarget.checked == true){
                const ef_fields = [this.emploifTarget, this.niveauEfTarget, this.finEfTarget];
                ef_fields.forEach((field) => {
                    if (!field.disabled && !field.value.trim()) {
                        field.classList.add('fr-select--error');
                        field.parentNode.classList.add('fr-select-group--error');
                    }
                })  
                if (this.echelonEfTitleTarget.classList.contains('select_inactive') == false && this.echelonEfTarget.value == ""){
                    this.echelonEfTarget.classList.add('fr-select--error');
                    this.echelonEfTarget.parentNode.classList.add('fr-select-group--error');  
                }                   
                if (this.dureeEchelonEfTitleTarget.classList.contains('select_inactive') == false && this.dureeEchelonEfTarget.value == ""){
                    this.dureeEchelonEfTarget.classList.add('fr-select--error');
                    this.dureeEchelonEfTarget.parentNode.classList.add('fr-select-group--error');  
                }
            }
            // si a des emplois fonctionnels futurs on verifie que les champs sont bien renseignés et on affiche en rouge ceux qui ne le sont pas 
            const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
            const debut_targets = [this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target];
            const duree_targets = [this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target];
            const niveau_targets = [this.niveauEf1Target,this.niveauEf2Target,this.niveauEf3Target,this.niveauEf4Target,this.niveauEf5Target,this.niveauEf6Target];
            [0,1,2,3,4,5].forEach((indice)=>{
              if (emploif_targets[indice].selectedIndex != 0){
                if (debut_targets[indice].selectedIndex == 0 ){
                    debut_targets[indice].classList.add('fr-select--error');
                    debut_targets[indice].parentNode.classList.add('fr-select-group--error');
                }
                if (duree_targets[indice].selectedIndex == 0){
                    duree_targets[indice].classList.add('fr-select--error');
                    duree_targets[indice].parentNode.classList.add('fr-select-group--error');
                }
                if (niveau_targets[indice].selectedIndex == 0){
                    niveau_targets[indice].classList.add('fr-select--error');
                    niveau_targets[indice].parentNode.classList.add('fr-select-group--error');
                }
              }
            })

            this.errorCorpsTarget.classList.remove('fr-hidden');
            this.errorCorpsTarget.innerHTML = "Veuillez remplir tous les champs obligatoires*";

            event.preventDefault();

        } else {
            // check des dates 
            let date_invalid = true;
            let projet_invalid = true;
            let dates_ef_invalid = true;

            const age = parseInt(this.ageTarget.value);
            const dates = [this.finEfTarget, this.grade2Target, this.grade3Target, this.grade4Target, this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target, this.debutProjetTarget, this.finProjetTarget];

            // si dates renseignées après retraite
            dates.forEach((date,indice) => {
            if (parseInt(date.value) >= 2023+67-age){
                date_invalid = false;
                dates[indice].classList.add('fr-select--error');
                dates[indice].parentNode.classList.add('fr-select-group--error');
            }
            })

            //si dates d emploi fonctionnel + promotions de grades pendant dispo
            const debut_targets = [this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target];
            const duree_targets = [this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target];
            const promo_targets = [this.grade2Target, this.grade3Target,this.grade4Target];
            if (this.debutProjetTarget.value != "" && this.finProjetTarget.value != ''){
                //ef futur interdit pdt dispo
                [0,1,2,3,4,5].forEach((indice)=>{
                  if (debut_targets[indice].value != '' && duree_targets[indice].value  != '' ){
                    if ( ( parseInt(this.debutProjetTarget.value) <= parseInt(debut_targets[indice].value) && parseInt(debut_targets[indice].value) < parseInt(this.finProjetTarget.value)) || ( parseInt(debut_targets[indice].value)  <= parseInt(this.debutProjetTarget.value) && parseInt(this.debutProjetTarget.value) < parseInt(debut_targets[indice].value) +parseInt(duree_targets[indice].value) ) || (parseInt(debut_targets[indice].value)  < parseInt(this.finProjetTarget.value) && parseInt(this.finProjetTarget.value) <= parseInt(debut_targets[indice].value) +parseInt(duree_targets[indice].value)) ){
                        projet_invalid = false;
                        debut_targets[indice].classList.add('fr-select--error');
                        debut_targets[indice].parentNode.classList.add('fr-select-group--error');
                        duree_targets[indice].classList.add('fr-select--error');
                        duree_targets[indice].parentNode.classList.add('fr-select-group--error'); 
                    }
                  }
                });
                // si ef actuel finit apres dispo 
                if (this.finEfTarget.value != ""){
                  if (parseInt(this.debutProjetTarget.value) < parseInt(this.finEfTarget.value)){
                    projet_invalid = false;
                    this.finEfTarget.classList.add('fr-select--error');
                    this.finEfTarget.parentNode.classList.add('fr-select-group--error');
                  }
                };
                //promo interdite pdt dispo
                [0,1,2].forEach((indice)=>{            
                  if (promo_targets[indice].value != ""){
                    if ((parseInt(this.debutProjetTarget.value) <= parseInt(promo_targets[indice].value)) &&  (parseInt(promo_targets[indice].value)< parseInt(this.finProjetTarget.value))){
                        projet_invalid = false;  
                        promo_targets[indice].classList.add('fr-select--error');
                        promo_targets[indice].parentNode.classList.add('fr-select-group--error'); 
                             
                    }
                  }
                })
                if (projet_invalid == false ){
                    this.debutProjetTarget.classList.add('fr-select--error');
                    this.debutProjetTarget.parentNode.classList.add('fr-select-group--error');
                    this.finProjetTarget.classList.add('fr-select--error');
                    this.finProjetTarget.parentNode.classList.add('fr-select-group--error');
                }
            }

            //si fin des ef après retraite
            [0,1,2,3,4,5].forEach((indice)=>{
            if (debut_targets[indice].value != ''){
                if (67-age < parseInt(debut_targets[indice].value) + parseInt(duree_targets[indice].value) - 2023 ){
                    date_invalid = false;
                    debut_targets[indice].classList.add('fr-select--error');
                    debut_targets[indice].parentNode.classList.add('fr-select-group--error');
                    duree_targets[indice].classList.add('fr-select--error');
                    duree_targets[indice].parentNode.classList.add('fr-select-group--error');
                }
            }
            });

            //verifie date croissante des ef 
            [0,1,2,3,4].forEach((indice)=>{
                if (debut_targets[indice+1].value != ''){
                    if (parseInt(debut_targets[indice].value) + parseInt(duree_targets[indice].value) > parseInt(debut_targets[indice+1].value)){
                        dates_ef_invalid = false;
                        duree_targets[indice].classList.add('fr-select--error');
                        duree_targets[indice].parentNode.classList.add('fr-select-group--error');
                        debut_targets[indice+1].classList.add('fr-select--error');
                        debut_targets[indice+1].parentNode.classList.add('fr-select-group--error');
                    }
                }
            });

            // si début premier ef est avant fin ef actuel 
            if (debut_targets[0].value != '' && this.finEfTarget.value !=''){
                if (parseInt(this.finEfTarget.value) > parseInt(debut_targets[0].value)){
                    dates_ef_invalid = false;
                    debut_targets[0].classList.add('fr-select--error');
                    debut_targets[0].parentNode.classList.add('fr-select-group--error');
                    this.finEfTarget.classList.add('fr-select--error');
                    this.finEfTarget.parentNode.classList.add('fr-select-group--error');
                }
            }


          if (date_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('fr-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates renseignées sont incompatibles avec l'âge renseigné. Elles doivent être inférieures à la date maximale de fin de votre carrière (67 ans).";
          } else if (projet_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('fr-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates d'un projet de disponibilité ne peuvent pas correspondre à des dates d'occupation d'un emploi fonctionnel ni de promotions de grade.";
          }else if (dates_ef_invalid == false){
            event.preventDefault();
            this.errorCorpsTarget.classList.remove('fr-hidden');
            this.errorCorpsTarget.innerHTML = "Les dates et durées de projections d'emplois fonctionnels doivent suivre un ordre croissant et ne peuvent pas se recouper.";
          
          
          }else {
            this.errorCorpsTarget.classList.add('fr-hidden');
            // met les resultats en texte
            const form_targets = [this.ageTarget,this.corpsTarget,this.gradeTarget,this.echelonTarget,this.dureeTarget,this.grade2Target,this.grade3Target,this.grade4Target, this.debutProjetTarget, this.finProjetTarget,this.emploifTarget,this.niveauEfTarget, this.echelonEfTarget,this.dureeEchelonEfTarget,this.finEfTarget];
            const result_targets = [this.resultAgeTarget,this.resultCorpsTarget,this.resultGradeTarget,this.resultEchelonTarget,this.resultDureeTarget,this.resultGrade2Target,this.resultGrade3Target,this.resultGrade4Target,this.resultdebutProjetTarget, this.resultfinProjetTarget,this.resultEmploifTarget, this.resultNiveauEfTarget,this.resultEchelonEfTarget,this.resultDureeEchelonEfTarget,this.resultFinEfTarget];
            
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].forEach((indice)=>{
              this.replaceHtml(form_targets[indice], result_targets[indice]);
            })
            
            this.resultAgeTarget.innerHTML = this.resultAgeTarget.innerHTML + ' ans';
            this.resultDureeTarget.innerHTML = this.resultDureeTarget.innerHTML + ' mois';
            this.resultDureeEchelonEfTarget.innerHTML = this.resultDureeEchelonEfTarget.innerHTML + ' mois';
            //enleve form et affiche uniquement resultats situation principales
            this.boutonSituationTarget.classList.remove('fr-hidden');
            this.resultSituationTarget.classList.remove('fr-hidden');              
            if (this.radioButtonTarget.checked == true){
                this.resultToggleEmploiTarget.innerHTML = "Oui";
                this.resultSituationEmploiTarget.classList.remove('fr-hidden');
            }else{
                this.resultToggleEmploiTarget.innerHTML = "Non";
                this.resultSituationEmploiTarget.classList.add('fr-hidden');
            }
            this.formSituationTarget.classList.add('fr-hidden');           
            this.contentToggleEmploiTarget.classList.add('fr-hidden');
            this.formEmploiTarget.classList.add('fr-hidden');
            
            //simulations 
            this.buttonSimulationTarget.classList.remove('fr-hidden');
            this.resultSimulationTarget.classList.remove('fr-hidden');     
            if (this.radioButtonSimulationTarget.checked == true){
                this.resultToggleSimulationTarget.classList.add('fr-hidden');
            }else{
                this.resultToggleSimulationTarget.classList.remove('fr-hidden');
                this.resultToggleSimulationTarget.innerHTML = "Simulations futures : Non"
            }
            this.contentToggleSimulationTarget.classList.add('fr-hidden');    
            this.formSimulationTarget.classList.add('fr-hidden');       

            // si dispo, affiche les resultat et si pas remplie complètement comme si vide  

            if (this.debutProjetTarget.value != '' && this.finProjetTarget.value != ''){ 
                this.resultDispoTarget.classList.remove('fr-hidden') ;
            }
            if (this.debutProjetTarget.value == '' || this.finProjetTarget.value == ''){                
                this.contentdispoTarget.classList.add('fr-hidden');
                this.buttonDeleteDispoTarget.classList.add('fr-hidden');
                this.buttonNewProjetTarget.classList.remove('fr-hidden');
                this.debutProjetTarget.selectedIndex =0;
                this.finProjetTarget.selectedIndex =0;
                this.resultDispoTarget.classList.add('fr-hidden') ;
            }
       
            this.showResult(this.grade2Target, this.resultShowGrade2Target);
            this.showResult(this.grade3Target, this.resultShowGrade3Target);
            this.showResult(this.grade4Target, this.resultShowGrade4Target);
         
            
            
            const results_show_emplois = [this.resultShowEmploif1Target,this.resultShowEmploif2Target,this.resultShowEmploif3Target,this.resultShowEmploif4Target,this.resultShowEmploif5Target,this.resultShowEmploif6Target]
            const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target, this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target,this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target,this.niveauEf1Target,this.niveauEf2Target,this.niveauEf3Target,this.niveauEf4Target,this.niveauEf5Target,this.niveauEf6Target];            
            const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target,this.resultDebutEf1Target,this.resultDebutEf2Target,this.resultDebutEf3Target,this.resultDebutEf4Target,this.resultDebutEf5Target,this.resultDebutEf6Target,this.resultDureeEf1Target,this.resultDureeEf2Target,this.resultDureeEf3Target,this.resultDureeEf4Target,this.resultDureeEf5Target,this.resultDureeEf6Target,this.resultNiveauEf1Target,this.resultNiveauEf2Target,this.resultNiveauEf3Target,this.resultNiveauEf4Target,this.resultNiveauEf5Target,this.resultNiveauEf6Target];
            const arr = Array.from({length:(24)},(v,k)=>k);
            arr.forEach((indice)=>{
                this.replaceHtml(emploif_targets[indice], result_emploif_targets[indice]);
            });
            [0,1,2,3,4,5].forEach((indice) => {
                this.showResult(emploif_targets[indice],results_show_emplois[indice]);
            });

            this.grapheTarget.classList.remove('fr-hidden');
            this.tableTarget.classList.remove('fr-hidden');
            
          } 
        
        }
    }
    showResult(el1, el2){
        if (el1.value != "") {
            el2.classList.remove('fr-hidden');
        }
        else{
            el2.classList.add('fr-hidden');
        }
    }

    replaceHtml(form, result){
        if (form.value == ""){
            //result.classList.add('fr-hidden');
            result.innerHTML = "∅";
        }else{
            result.classList.remove('fr-hidden');
            if (form == this.dureeTarget || form == this.dureeEchelonEfTarget){
                result.innerHTML = form.value-1;
            } else{
                result.innerHTML = form.value;
            }
            
        }
    }

    reset_situation(event){
        event.preventDefault();
        this.grapheTarget.classList.add('fr-hidden');
        this.tableTarget.classList.add('fr-hidden');

        this.resultSituationTarget.classList.add('fr-hidden');
        this.formSituationTarget.classList.remove('fr-hidden');     
        this.contentToggleEmploiTarget.classList.remove('fr-hidden');
        if (this.radioButtonTarget.checked == true){
            this.formEmploiTarget.classList.remove('fr-hidden');
        }
       
    }
    reset_simulation(event){
        event.preventDefault();
        this.grapheTarget.classList.add('fr-hidden');
        this.tableTarget.classList.add('fr-hidden');

        this.resultSimulationTarget.classList.add('fr-hidden');       
        this.contentToggleSimulationTarget.classList.remove('fr-hidden');
         if (this.radioButtonSimulationTarget.checked == true){
            this.formSimulationTarget.classList.remove('fr-hidden');
        }      
    }

    toggleEmploi(event){
        const arr = [this.emploifTarget, this.niveauEfTarget, this.echelonEfTarget, this.dureeEchelonEfTarget, this.finEfTarget]
        const checkedRadio = this.radioButtonTarget.checked;
        if (checkedRadio == true){
          this.formEmploiTarget.classList.remove('fr-hidden');
        
        }else{
          this.formEmploiTarget.classList.add('fr-hidden');
          // reset tous les champs à selectionner
          arr.forEach((el) => {
            el.selectedIndex = 0; 
          })
        }
        this.validateForm(); 
    }

    toggleSimulation(event){

        const checkedRadio = this.radioButtonSimulationTarget.checked;
        if (checkedRadio == true){
          this.formSimulationTarget.classList.remove('fr-hidden');
        
        }else{
          this.formSimulationTarget.classList.add('fr-hidden');
          this.deleteDispo();
          this.deleteGrades();
          this.deleteEf();
        }
    }


    deleteEf(e){
        const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
        const debut_targets = [this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target];
        const duree_targets = [this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target];
        const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
        const niveau_targets = [this.niveauEf1Target,this.niveauEf2Target,this.niveauEf3Target,this.niveauEf4Target,this.niveauEf5Target,this.niveauEf6Target];
        [0,1,2,3,4,5].forEach((indice)=> {
            emploif_targets[indice].selectedIndex =0;
            debut_targets[indice].selectedIndex =0;
            duree_targets[indice].selectedIndex =0;
            niveau_targets[indice].selectedIndex = 0;
            content_targets[indice].classList.add('fr-hidden');
        })
    
    }

    toggleEf(e){

        this.errorCorpsTarget.classList.add('fr-hidden');
        this.errorTarget.innerHTML = "";
        const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
        const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
        const debut_targets = [this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target];
        const duree_targets = [this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target];

        [6,5,4,3,2].forEach((indice) => {
            if (content_targets[indice-1].classList.contains('fr-hidden') && (content_targets[indice-2].classList.contains('fr-hidden')==false)){
                if (emploif_targets[indice-2].selectedIndex != 0 && debut_targets[indice-2].selectedIndex != 0 && duree_targets[indice-2].selectedIndex != 0 ){
                    content_targets[indice-1].classList.remove('fr-hidden');
                    if (indice == 6){
                        this.boutonTarget.classList.add('fr-hidden');
                    }
                }
                else{
              this.errorTarget.classList.remove('fr-hidden');
                    this.errorTarget.innerHTML = "Vous devez d'abord sélectionner tous les champs ci-dessus avant de pouvoir ajouter un nouvel emploi fonctionnel";
                }
            }
        })
        if (this.content1Target.classList.contains('fr-hidden')){
            // si ef select mais pas les dates 
            if (this.emploifTarget.selectedIndex != 0 && ((this.echelonEfTitleTarget.classList.contains('select_inactive') == false && this.echelonEfTarget.selectedIndex == 0) || (this.dureeEchelonEfTitleTarget.classList.contains('select_inactive') == false && this.dureeEchelonEfTarget.selectedIndex == 0) || this.finEfTarget.selectedIndex == 0)){
              this.errorSituationTarget.classList.remove('fr-hidden');
              this.errorSituationTarget.innerHTML = "Veuillez sélectionner tous les champs ci-dessus";
            }else{           
                this.errorSituationTarget.classList.add('fr-hidden');
                this.content1Target.classList.remove('fr-hidden');
            }         
        }
        e.preventDefault();
      }

    removeEf(e){
        e.preventDefault();

        this.errorCorpsTarget.classList.add('fr-hidden');
        this.errorTarget.classList.add('fr-hidden');
        const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
        const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
        const debut_targets = [this.debutEf1Target,this.debutEf2Target,this.debutEf3Target,this.debutEf4Target,this.debutEf5Target,this.debutEf6Target];
        const duree_targets = [this.dureeEf1Target,this.dureeEf2Target,this.dureeEf3Target,this.dureeEf4Target,this.dureeEf5Target,this.dureeEf6Target];
        const niveau_targets = [this.niveauEf1Target,this.niveauEf2Target,this.niveauEf3Target,this.niveauEf4Target,this.niveauEf5Target,this.niveauEf6Target];
        var id = parseInt(e.target.dataset.value);
        const arr = Array.from({length:(6-id)},(v,k)=>k+id);

        arr.forEach((indice) => {
          if (content_targets[indice].classList.contains('fr-hidden') == false) { // si celui dapres etait ouvert on switch 
            emploif_targets[indice-1].value = emploif_targets[indice].value;
            debut_targets[indice-1].value = debut_targets[indice].value;
            duree_targets[indice-1].value = duree_targets[indice].value;

            var niveau_1 = niveau_targets[indice].value;
 
              
            // mettre à jour les niveaux  
            this.resetChamp(niveau_targets[indice-1]);  
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const url = "/select_niveau";
            const emploi = emploif_targets[indice-1].value;
            const body = {emploi};
            fetch(url, { 
              method: 'POST', 
              body: JSON.stringify(body),
              credentials: "include",
              dataType: 'script',
              headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
              },
            })
            .then(response => response.json()/*response.text()*/)
            .then(data => {                
                data.niveauEf.forEach((niveau) => {
                const opt = document.createElement("option");
                opt.value = niveau;
                opt.innerHTML = "Niveau "+ niveau;
                opt.selected = parseInt(niveau) === parseInt(niveau_1);
                niveau_targets[indice-1].appendChild(opt);
                })
            }) 

            niveau_targets[indice-1].value = niveau_targets[indice].value; 

          }else{
            content_targets[indice-1].classList.add('fr-hidden');
            emploif_targets[indice-1].selectedIndex = 0;
            duree_targets[indice-1].selectedIndex = 0;
            debut_targets[indice-1].selectedIndex = 0;
            niveau_targets[indice-1].selectedIndex = 0;
          }
        })

        this.content6Target.classList.add('fr-hidden');
        this.boutonTarget.classList.remove('fr-hidden');
        this.emploif6Target.selectedIndex = 0;
        this.debutEf6Target.selectedIndex = 0;
        this.dureeEf6Target.selectedIndex = 0;
        this.niveauEf6Target.selectedIndex = 0;
        
        
      }

    addDispo(e){
        e.preventDefault();
        this.errorCorpsTarget.classList.add('fr-hidden');
        this.buttonNewProjetTarget.classList.add('fr-hidden');
        this.contentdispoTarget.classList.remove('fr-hidden');
        this.buttonDeleteDispoTarget.classList.remove('fr-hidden');
        this.finProjetTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- sélectionner -";
        this.finProjetTarget.appendChild(option);
    }

    deleteDispo(e){
        this.errorCorpsTarget.classList.add('fr-hidden');
        this.buttonNewProjetTarget.classList.remove('fr-hidden');
        this.contentdispoTarget.classList.add('fr-hidden');
        this.buttonDeleteDispoTarget.classList.add('fr-hidden');
        this.debutProjetTarget.selectedIndex =0;
        this.finProjetTarget.selectedIndex =0;     
        
      }

    addGrades(e){
        e.preventDefault();
        this.errorCorpsTarget.classList.add('fr-hidden');
        this.buttonNewGradesTarget.classList.add('fr-hidden');
        this.buttonDeleteGradesTarget.classList.remove('fr-hidden');
        this.contentgradesTarget.classList.remove('fr-hidden');
    }
    deleteGrades(e){
     
        this.errorCorpsTarget.classList.add('fr-hidden');
        this.buttonNewGradesTarget.classList.remove('fr-hidden');
        this.buttonDeleteGradesTarget.classList.add('fr-hidden');
        this.contentgradesTarget.classList.add('fr-hidden');
        this.grade2Target.selectedIndex =0;
        this.grade3Target.selectedIndex =0;
        this.grade4Target.selectedIndex =0;
    }

    
  

}

function getSelectedValues(event) {
        return [...event.target.selectedOptions].map(option => option.value)
    }