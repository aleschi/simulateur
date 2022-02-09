import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
    static targets = [ "gradeId", "echelonId", "dureeId"];

  	connect() {
  	 this.filters =  { corps: [], grades: [], echelons: []}

  	}

    corpsChange(event) {
        this.filters.corps = getSelectedValues(event)
        this.change()
    }

    gradesChange(event) {
        this.filters.grades = getSelectedValues(event)
        this.change2()
    }

    echelonsChange(event) {
        this.filters.echelons = getSelectedValues(event)
        this.change3()
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
        })
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
        this.updateEchelons(data)
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
            //option.innerHTML = "Grade " + grade;
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
            //option.innerHTML = "Grade " + grade;
            option.innerHTML = duree;
            this.dureeIdTarget.appendChild(option);
        })
    }


}

function getSelectedValues(event) {
        return [...event.target.selectedOptions].map(option => option.value)
    }