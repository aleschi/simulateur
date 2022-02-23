import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static targets = [ "gradeId", "echelonId", "dureeId", "grade2", "grade3", "grade4",'grade2Title','grade3Title','grade4Title',
     'emploifEchelon','dureefEchelon','finfEchelon','debutfEmploi',
     'debutfEmploi1','debutfEmploi2','debutfEmploi3','debutfEmploi4','debutfEmploi5','debutfEmploi6',
     'dureefEmploi1','dureefEmploi2','dureefEmploi3','dureefEmploi4','dureefEmploi5','dureefEmploi6',
     'resultEchelonf','resultDureef','resultFinf','resultDebutf',
     "error1",'errorCorps'];

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
        this.grade2Target.innerHTML = ""
        this.grade3Target.innerHTML = ""
        this.grade4Target.innerHTML = ""
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.change()
    }

    gradesChange(event) {
        this.filters.grades = getSelectedValues(event)
        this.filters.echelons = []
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.change2()
    }

    echelonsChange(event) {
        this.filters.echelons = getSelectedValues(event)
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.change3()
    }

    promoGrade2Change(event){
        this.filters.grade2 = getSelectedValues(event)
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.changePromoGrade2()
    }

    promoGrade3Change(event){
        this.filters.grade3 = getSelectedValues(event)
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
        this.gradeIdTarget.innerHTML = "";
        
        this.dureeIdTarget.innerHTML = "";
        this.echelonIdTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.gradeIdTarget.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = "";
        option2.innerHTML = "- Selectionner -";
        this.echelonIdTarget.appendChild(option2);

        const option3 = document.createElement("option");
        option3.value = "";
        option3.innerHTML = "- Selectionner -";
        this.dureeIdTarget.appendChild(option3);

        data.grades.forEach((grade) => {
            const option = document.createElement("option");
            option.value = grade;
            //option.innerHTML = "Grade " + grade;
            option.innerHTML = grade;
            this.gradeIdTarget.appendChild(option);
        })
    }

    updateEchelons(data){
        this.echelonIdTarget.innerHTML = "";
        this.dureeIdTarget.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.echelonIdTarget.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = "";
        option2.innerHTML = "- Selectionner -";
        this.dureeIdTarget.appendChild(option2);

        data.echelons.forEach((echelon) => {
            const option = document.createElement("option");
            option.value = echelon;
            option.innerHTML = echelon;
            this.echelonIdTarget.appendChild(option);
        })
    }

    updateDurees(data){
        this.dureeIdTarget.innerHTML = "";
        const option = document.createElement("option");
            option.value = "";
            option.innerHTML = "- Selectionner -";
            this.dureeIdTarget.appendChild(option);
        data.durees.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;
            if (duree == 1){
                option.innerHTML = duree + " an";
            }else{
              option.innerHTML = duree + " ans";  
            }
            
            this.dureeIdTarget.appendChild(option);
        })
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
                    option.value = ar-2022;
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
            
            data.array_grade3.forEach((ar) => {
            const option = document.createElement("option");
            option.value = ar-2022;
            option.innerHTML = ar;
            this.grade3Target.appendChild(option);
        })
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
            option.value = ar-2022;
            option.innerHTML = ar;
            this.grade4Target.appendChild(option);
            })
        }
    }

    // emplois fonctionnels

    emploifChange(event){
        this.errorCorpsTarget.classList.add('visually-hidden');
        this.filters.emploif = getSelectedValues(event);
        this.filters.echelonf = [];
        
        const form_targets = [this.emploifEchelonTarget,this.dureefEchelonTarget, this.finfEchelonTarget, this.debutfEmploiTarget];
        const result_targets = [this.resultEchelonfTarget, this.resultDureefTarget, this.resultFinfTarget, this.resultDebutfTarget];
        this.error1Target.classList.add('visually-hidden');
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
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";
        this.dureefEchelonTarget.appendChild(option);

        data.dureef.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;
            if (duree == 1){
                option.innerHTML = duree + " an";
            }else{
              option.innerHTML = duree + " ans";  
            }
            
            this.dureefEchelonTarget.appendChild(option);
        })
    }


    
    emploifChange2(event){
        this.errorCorpsTarget.classList.add('visually-hidden');
        var id = event.target.dataset.value;
        const emploi = getSelectedValues(event);
        const dates_arr = Array.from({length:42},(v,k)=>k+2023);
      
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- Selectionner -";

        var target ,target2 ;
        //var data_non_dispo = [];
        var nouvelles_dates = [];

        var debut_targets = [this.debutfEmploi1Target,this.debutfEmploi2Target,this.debutfEmploi3Target,this.debutfEmploi4Target,this.debutfEmploi5Target,this.debutfEmploi6Target];
        var duree_targets = [this.dureefEmploi1Target,this.dureefEmploi2Target,this.dureefEmploi3Target,this.dureefEmploi4Target,this.dureefEmploi5Target,this.dureefEmploi6Target];
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
      

}

function getSelectedValues(event) {
        return [...event.target.selectedOptions].map(option => option.value)
    }