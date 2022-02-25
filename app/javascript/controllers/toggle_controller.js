import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["error","error1","error2","bouton","content","content1","content2","content3","content4","content5","content6",
  "trash1","trash2","trash3","trash4","trash5","trash6",
  "emploif1","emploif2","emploif3","emploif4","emploif5","emploif6",
  "debutf1","debutf2","debutf3","debutf4","debutf5","debutf6",
  "dureef1","dureef2","dureef3","dureef4","dureef5","dureef6",
  "resultEmploif1","resultEmploif2","resultEmploif3","resultEmploif4","resultEmploif5","resultEmploif6",
  "resultDebutf1","resultDebutf2","resultDebutf3","resultDebutf4","resultDebutf5","resultDebutf6",
  "resultDureef1","resultDureef2","resultDureef3","resultDureef4","resultDureef5","resultDureef6",
  "resultEmploif","resultEchelonf","resultDureef","resultFinf","resultDebutf",
  "emploif","emploifEchelon","dureefEchelon","finfEchelon",'debutfEmploi',
  "boutonEdit","errorCorps"];

  connect() { 
  }

  toggle() {
    this.contentTargets.forEach((t) => t.classList.toggle(this.data.get("class")));
  }

	
  toggle1(e){
  	const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
 	  const trash_targets = [this.trash1Target,this.trash2Target,this.trash3Target,this.trash4Target,this.trash5Target,this.trash6Target];
  	const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
  	const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
  	const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
  	const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
  	const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
  	const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];

    const result_emploi_f = [this.resultEmploifTarget, this.resultEchelonfTarget,this.resultDureefTarget,this.resultFinfTarget,this.resultDebutfTarget]
  	const emploi_f = [this.emploifTarget,this.emploifEchelonTarget, this.dureefEchelonTarget, this.finfEchelonTarget, this.debutfEmploiTarget];

    [6,5,4,3,2].forEach((indice) => {
  		if (content_targets[indice-1].classList.contains('visually-hidden') && (content_targets[indice-2].classList.contains('visually-hidden')==false)){
	  		if (emploif_targets[indice-2].selectedIndex != 0 && debut_targets[indice-2].selectedIndex != 0 && duree_targets[indice-2].selectedIndex != 0 ){
	  			content_targets[indice-1].classList.remove('visually-hidden');
	  			trash_targets[indice-2].classList.add('visually-hidden');

	  			emploif_targets[indice-2].classList.add('visually-hidden');
	  			debut_targets[indice-2].classList.add('visually-hidden');
	  			duree_targets[indice-2].classList.add('visually-hidden');
	  			result_emploif_targets[indice-2].classList.remove('visually-hidden');
	  			result_emploif_targets[indice-2].innerHTML = emploif_targets[indice-2].value;
	  			result_debut_targets[indice-2].classList.remove('visually-hidden');
	  			result_debut_targets[indice-2].innerHTML = debut_targets[indice-2].value;
	  			result_duree_targets[indice-2].classList.remove('visually-hidden');
	  			result_duree_targets[indice-2].innerHTML = duree_targets[indice-2].value + " ans";

		        debut_targets[indice-1].innerHTML = ""
		        const option = document.createElement("option");
	            option.value = "";
	            option.innerHTML = "- Selectionner -";
	            debut_targets[indice-1].appendChild(option);

	  			this.errorTarget.innerHTML = "";
	  			if (indice == 6){
	  				this.boutonTarget.classList.add('visually-hidden');
	  			}
	  		}
	  		else{
          this.errorTarget.classList.remove('visually-hidden');
  				this.errorTarget.innerHTML = "Vous devez d'abord sélectionner tous les champs ci-dessus avant de pouvoir ajouter un nouvel emploi fonctionnel";
  			}
  		}
  	})
  	if (this.content1Target.classList.contains('visually-hidden')){
  
      // verifie qua bien ajouté un emploi 
      if (this.emploifTarget.selectedIndex == 0){
        this.error1Target.classList.remove('visually-hidden');
        this.error1Target.innerHTML = "Veuillez sélectionner un champ ci-dessous";
      }else{
        // si ef select mais pas les dates 
        if (this.emploifTarget.selectedIndex != 1 && (this.emploifEchelonTarget.selectedIndex == 0 || this.dureefEchelonTarget.selectedIndex == 0 || this.finfEchelonTarget.selectedIndex == 0)){
          this.error2Target.classList.remove('visually-hidden');
          this.error2Target.innerHTML = "Veuillez sélectionner tous les champs ci-dessus";
        }else{
        // on ne peut plus modifier emploi f actuel 
        [0,1,2,3,4].forEach((indice) => {
          result_emploi_f[indice].classList.remove('visually-hidden');
          if (emploi_f[indice].value == undefined || emploi_f[indice].value == "" ){
          result_emploi_f[indice].innerHTML = "-";
          }else{
          result_emploi_f[indice].innerHTML = emploi_f[indice].value;
          }
          emploi_f[indice].classList.add('visually-hidden');
        });
        this.error1Target.classList.add('visually-hidden');
        this.error2Target.classList.add('visually-hidden');
    		this.content1Target.classList.remove('visually-hidden');
        this.boutonEditTarget.classList.remove('visually-hidden');
        }
      }
  	}
  	e.preventDefault();
  }

  toggle2(e){
  	const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
 	  const trash_targets = [this.trash1Target,this.trash2Target,this.trash3Target,this.trash4Target,this.trash5Target,this.trash6Target];
  	const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
  	const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
  	const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
  	const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
  	const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
  	const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];

    this.errorTarget.classList.add('visually-hidden');
  	if (this.content2Target.classList.contains('visually-hidden') && (this.content1Target.classList.contains('visually-hidden')==false)){
  		  this.content1Target.classList.add('visually-hidden');
  		  this.emploif1Target.selectedIndex = 0;
        this.debutf1Target.selectedIndex = 0;
        this.dureef1Target.selectedIndex = 0;
  	}
  	[2,3,4,5].forEach((indice) => {
  		if (content_targets[indice].classList.contains('visually-hidden') && (content_targets[indice-1].classList.contains('visually-hidden')==false)){
  			
        content_targets[indice-1].classList.add('visually-hidden');
	  		trash_targets[indice-2].classList.remove('visually-hidden');

	  		emploif_targets[indice-2].classList.remove('visually-hidden');
	  		debut_targets[indice-2].classList.remove('visually-hidden');
	  		duree_targets[indice-2].classList.remove('visually-hidden');
	  		result_emploif_targets[indice-2].classList.add('visually-hidden');
	  		result_debut_targets[indice-2].classList.add('visually-hidden');
	  		result_duree_targets[indice-2].classList.add('visually-hidden');

	  		emploif_targets[indice-1].selectedIndex = 0;
	      duree_targets[indice-1].selectedIndex = 0;

  		}
  	})
  	if (this.content6Target.classList.contains('visually-hidden')==false){
  		this.content6Target.classList.add('visually-hidden');
  		this.trash5Target.classList.remove('visually-hidden');

  		this.emploif5Target.classList.remove('visually-hidden');
  		this.debutf5Target.classList.remove('visually-hidden');
  		this.dureef5Target.classList.remove('visually-hidden');
  		this.resultEmploif5Target.classList.add('visually-hidden');
  		this.resultDebutf5Target.classList.add('visually-hidden');
  		this.resultDureef5Target.classList.add('visually-hidden');

  		this.boutonTarget.classList.remove('visually-hidden');

  		this.emploif6Target.selectedIndex = 0;
        this.debutf6Target.selectedIndex = 0;
        this.dureef6Target.selectedIndex = 0;
  	}
  	
  	e.preventDefault();
  }

  reset(e){
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
    const trash_targets = [this.trash1Target,this.trash2Target,this.trash3Target,this.trash4Target,this.trash5Target,this.trash6Target];
    const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
    const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
    const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
    const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
    const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
    const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];

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

    [0,1,2,3,4,5].forEach((indice) => {
        content_targets[indice].classList.add('visually-hidden');

        emploif_targets[indice].classList.remove('visually-hidden');
        debut_targets[indice].classList.remove('visually-hidden');
        duree_targets[indice].classList.remove('visually-hidden');
        result_emploif_targets[indice].classList.add('visually-hidden');
        result_debut_targets[indice].classList.add('visually-hidden');
        result_duree_targets[indice].classList.add('visually-hidden');

        emploif_targets[indice].selectedIndex = 0;
        duree_targets[indice].selectedIndex = 0;
        debut_targets[indice].selectedIndex = 0;
    })
    e.preventDefault();
  }

}
