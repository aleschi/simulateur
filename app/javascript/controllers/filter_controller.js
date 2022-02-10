import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static targets = [ "gradeId", "echelonId", "dureeId", "grade2", "grade3", "grade4", "gradeTitle", 'echelonTitle', 'dureeTitle','grade2Title','grade3Title','grade4Title',
     'emploiTitle','emploifdureeTitle','emploiffinTitle','emploifEchelon','dureefEchelon','finfEchelon'];

  	connect() {
  	 this.filters =  { corps: [], grades: [], echelons: [], emploif: [], echelonf: [], dureef: []}

  	}

    corpsChange(event) {
        this.filters.corps = getSelectedValues(event)
        this.gradeTitleTarget.classList.remove("select_inactive")
        this.change()
    }

    gradesChange(event) {
        this.filters.grades = getSelectedValues(event)
        this.echelonTitleTarget.classList.remove("select_inactive")
        this.change2()

    }

    echelonsChange(event) {
        this.filters.echelons = getSelectedValues(event)
        this.dureeTitleTarget.classList.remove("select_inactive")
        this.change3()
    }

    emploifChange(event){
        this.filters.emploif = getSelectedValues(event)
        this.emploiTitleTarget.classList.remove("select_inactive")
        this.changeEchelon()
    }

    echelonfChange(event){
        this.filters.echelonf = getSelectedValues(event)    
        this.emploifdureeTitleTarget.classList.remove("select_inactive")
        this.changeDatesf()
    }

    dureefChange(event){
        this.filters.dureef = getSelectedValues(event)    
        this.emploiffinTitleTarget.classList.remove("select_inactive")
        this.changeFinf()
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

    changeFinf() {
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
        this.updateFinf(data)
        })
    }

    updateGrades(data){
        this.gradeIdTarget.innerHTML = "";
            const option = document.createElement("option");
            option.value = null;
            option.innerHTML = "Select";
            this.gradeIdTarget.appendChild(option);
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
        const option = document.createElement("option");
        option.value = null;
        option.innerHTML = "Select";
        this.echelonIdTarget.appendChild(option);
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
            option.value = null;
            option.innerHTML = "Select";
            this.dureeIdTarget.appendChild(option);
        data.durees.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;
            option.innerHTML = duree;
            this.dureeIdTarget.appendChild(option);
        })
    }

    updatePromotions(data){
        const grade = data.grades;
        const max_grade = data.max_grade
        this.grade2Target.innerHTML = "";
            this.grade3Target.innerHTML = "";
            this.grade4Target.innerHTML = "";
        if (grade == 1){
            this.grade2TitleTarget.classList.remove("select_inactive")
            const option = document.createElement("option");
            option.value = null;
            option.innerHTML = "Select";
            this.grade2Target.appendChild(option);

            data.array.forEach((ar) => {
            const option = document.createElement("option");
            option.value = ar-2021;
            option.innerHTML = ar;
            this.grade2Target.appendChild(option);
        })
        }
        if (grade == 2 && max_grade > 2){
           this.grade3TitleTarget.classList.remove("select_inactive")
            const option = document.createElement("option");
            option.value = null;
            option.innerHTML = "Select";
            this.grade3Target.appendChild(option);
            
            data.array_grade3.forEach((ar) => {
            const option = document.createElement("option");
            option.value = ar;
            option.innerHTML = ar;
            this.grade3Target.appendChild(option);
        })
        }
        if (grade == 3 && max_grade > 3){
            this.grade4TitleTarget.classList.remove("select_inactive")
            const option = document.createElement("option");
            option.value = null;
            option.innerHTML = "Select";
            this.grade4Target.appendChild(option);
            
            data.array.forEach((ar) => {
            const option = document.createElement("option");
            option.value = ar;
            option.innerHTML = ar;
            this.grade4Target.appendChild(option);
        })
        }
    }

    updateEf(data){
        this.emploifEchelonTarget.innerHTML = "";
        const option = document.createElement("option");
            option.value = null;
            option.innerHTML = "Select";
            this.emploifEchelonTarget.appendChild(option);
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
            option.value = null;
            option.innerHTML = "Select";
            this.dureefEchelonTarget.appendChild(option);
        data.dureef.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;
            option.innerHTML = duree;
            this.dureefEchelonTarget.appendChild(option);
        })
    }

    updateFinf(data){
        this.finfEchelonTarget.innerHTML = "";
        const option = document.createElement("option");
            option.value = null;
            option.innerHTML = "Select";
            this.finfEchelonTarget.appendChild(option);
        data.finf.forEach((duree) => {
            const option = document.createElement("option");
            option.value = duree;
            option.innerHTML = duree;
            this.finfEchelonTarget.appendChild(option);
        })
    }


}

function getSelectedValues(event) {
        return [...event.target.selectedOptions].map(option => option.value)
    }