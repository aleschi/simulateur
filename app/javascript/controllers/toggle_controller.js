import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
  return ["error","error2","bouton","content",'titreEf',"content1","content2","content3","content4","content5","content6",
  "emploif1","emploif2","emploif3","emploif4","emploif5","emploif6",
  "debutf1","debutf2","debutf3","debutf4","debutf5","debutf6",
  "dureef1","dureef2","dureef3","dureef4","dureef5","dureef6",
  "resultEmploif1","resultEmploif2","resultEmploif3","resultEmploif4","resultEmploif5","resultEmploif6",
  "resultDebutf1","resultDebutf2","resultDebutf3","resultDebutf4","resultDebutf5","resultDebutf6",
  "resultDureef1","resultDureef2","resultDureef3","resultDureef4","resultDureef5","resultDureef6",
  "resultEmploif","resultEchelonf","resultDureef","resultFinf","resultDebutf",
  "emploif","emploifEchelon","dureefEchelon","finfEchelon",'debutfEmploi',
  "errorCorps",'contentdispo','boutonprojet','debutProjet','finProjet','boutonTrashProjet','resultdebutProjet','resultfinProjet','boutonDispo',
  ];
}

  connect() { 
  }

  toggle() {
    this.contentTargets.forEach((t) => t.classList.toggle(this.data.get("class")));
  }

	
  toggle1(e){
    this.errorCorpsTarget.classList.add('fr-hidden');
    this.errorTarget.innerHTML = "";
  	const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
 	  const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
  	const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
  	const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
  	const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
  	const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
  	const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];

    const result_emploi_f = [this.resultEmploifTarget, this.resultEchelonfTarget,this.resultDureefTarget,this.resultFinfTarget,this.resultDebutfTarget]
  	const emploi_f = [this.emploifTarget,this.emploifEchelonTarget, this.dureefEchelonTarget, this.finfEchelonTarget, this.debutfEmploiTarget];

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
        if (this.emploifTarget.selectedIndex != 0 && (this.emploifEchelonTarget.selectedIndex == 0 || this.dureefEchelonTarget.selectedIndex == 0 || this.finfEchelonTarget.selectedIndex == 0)){
          this.error2Target.classList.remove('fr-hidden');
          this.error2Target.innerHTML = "Veuillez sélectionner tous les champs ci-dessus";
        }else{

        this.titreEfTarget.classList.remove('fr-hidden');
        this.error2Target.classList.add('fr-hidden');
    		this.content1Target.classList.remove('fr-hidden');
        }
      
  	}
  	e.preventDefault();
  }

  toggle2(e){
    e.preventDefault();

    this.errorCorpsTarget.classList.add('fr-hidden');
    this.errorTarget.classList.add('fr-hidden');
  	const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target];
 	  const emploif_targets = [this.emploif1Target,this.emploif2Target,this.emploif3Target,this.emploif4Target,this.emploif5Target,this.emploif6Target];
  	const debut_targets = [this.debutf1Target,this.debutf2Target,this.debutf3Target,this.debutf4Target,this.debutf5Target,this.debutf6Target];
  	const duree_targets = [this.dureef1Target,this.dureef2Target,this.dureef3Target,this.dureef4Target,this.dureef5Target,this.dureef6Target];
  	const result_emploif_targets = [this.resultEmploif1Target,this.resultEmploif2Target,this.resultEmploif3Target,this.resultEmploif4Target,this.resultEmploif5Target,this.resultEmploif6Target];
  	const result_debut_targets = [this.resultDebutf1Target,this.resultDebutf2Target,this.resultDebutf3Target,this.resultDebutf4Target,this.resultDebutf5Target,this.resultDebutf6Target];
  	const result_duree_targets = [this.resultDureef1Target,this.resultDureef2Target,this.resultDureef3Target,this.resultDureef4Target,this.resultDureef5Target,this.resultDureef6Target];

    var id = parseInt(e.target.dataset.value);
    const arr = Array.from({length:(6-id)},(v,k)=>k+id);

    arr.forEach((indice) => {
      if (content_targets[indice].classList.contains('fr-hidden') == false) { // si celui dapres etait ouvert on switch 
        emploif_targets[indice-1].value = emploif_targets[indice].value;
        debut_targets[indice-1].value = debut_targets[indice].value;
        duree_targets[indice-1].value = duree_targets[indice].value;
        result_emploif_targets[indice-1].innerHTML = emploif_targets[indice].value;
        result_debut_targets[indice-1].innerHTML = debut_targets[indice].value;
        result_duree_targets[indice-1].innerHTML = duree_targets[indice].value + ' ans';
        if (emploif_targets[indice].classList.contains('fr-hidden') == false){ //on met tous en formulaire
          emploif_targets[indice-1].classList.remove('fr-hidden');
          debut_targets[indice-1].classList.remove('fr-hidden');
          duree_targets[indice-1].classList.remove('fr-hidden');
          result_emploif_targets[indice-1].classList.add('fr-hidden');
          result_debut_targets[indice-1].classList.add('fr-hidden');
          result_duree_targets[indice-1].classList.add('fr-hidden');
        }

      }else{
        content_targets[indice-1].classList.add('fr-hidden');
        emploif_targets[indice-1].selectedIndex = 0;
        duree_targets[indice-1].selectedIndex = 0;
        debut_targets[indice-1].selectedIndex = 0;
        emploif_targets[indice-1].classList.remove('fr-hidden');
        debut_targets[indice-1].classList.remove('fr-hidden');
        duree_targets[indice-1].classList.remove('fr-hidden');
        result_emploif_targets[indice-1].classList.add('fr-hidden');
        result_debut_targets[indice-1].classList.add('fr-hidden');
        result_duree_targets[indice-1].classList.add('fr-hidden');
        if (indice == 1){
          this.titreEfTarget.classList.add('fr-hidden');
        }
      }
    })

    this.content6Target.classList.add('fr-hidden');
    this.boutonTarget.classList.remove('fr-hidden');
    this.emploif6Target.selectedIndex = 0;
    this.debutf6Target.selectedIndex = 0;
    this.dureef6Target.selectedIndex = 0;
  	
  	
  }

  toggleprojet(e){
    e.preventDefault();
    this.errorCorpsTarget.classList.add('fr-hidden');
    this.boutonprojetTarget.classList.add('fr-hidden');
    this.contentdispoTarget.classList.remove('fr-hidden');
    this.boutonTrashProjetTarget.classList.remove('fr-hidden');
    this.finProjetTarget.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.innerHTML = "- sélectionner -";
    this.finProjetTarget.appendChild(option);
  }
  toggleprojet2(e){
    e.preventDefault();
    this.boutonprojetTarget.classList.remove('fr-hidden');
    this.contentdispoTarget.classList.add('fr-hidden');
    this.boutonTrashProjetTarget.classList.add('fr-hidden');
    this.debutProjetTarget.selectedIndex =0;
    this.finProjetTarget.selectedIndex =0;
    this.debutProjetTarget.classList.remove('fr-hidden');
    this.finProjetTarget.classList.remove('fr-hidden');
    this.resultdebutProjetTarget.classList.add('fr-hidden');
    this.resultfinProjetTarget.classList.add('fr-hidden');
    this.boutonDispoTarget.classList.add('fr-hidden');
    this.errorCorpsTarget.classList.add('fr-hidden');

  }

  

}
