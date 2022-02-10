class GrillesController < ApplicationController
  def index

  end
  
  def search_grilles
  	@age = params[:age].to_i
  	@duree_carriere = 70 - @age

  	#calcul indice de base dans le corps de l'agent hors emploi fonctionnel 
  	@indice_corps = Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon], duree: params[:duree], type_emploi: "non fonctionnel").first.indice
  	
  	#liste indice corps de l'agent 
  	@liste_indices = Grille.where(corps: params[:corps], grade: params[:grade],type_emploi: "non fonctionnel").where("echelon > ? OR (echelon = ? AND duree >= ?)",params[:echelon],params[:echelon],params[:duree]).order('echelon ASC, duree ASC').pluck(:indice)
  	@liste_indices = @liste_indices[0..@duree_carriere-1]
  	

  	#calcul indice de base si est dans emploi fonctionnel
  	if !params[:type_emploi].nil? && params[:type_emploi] != "non fonctionnel"
 		@fin_emploi = params[:fin_emploif].to_i
  		@indice_emploi = Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon_emploif], duree: params[:duree_emploif], type_emploi: params[:type_emploi]).first.indice
  		@liste_indices_emploi = Grille.where(corps: params[:corps], grade: params[:grade],type_emploi: params[:type_emploi]).where("echelon > ? OR (echelon = ? AND duree >= ?)",params[:echelon],params[:echelon],params[:duree]).order('echelon ASC, duree ASC').pluck(:indice)
  		if !@fin_emploi.nil? #après reprend emploi corps 
  			@liste_indices_emploi = @liste_indices_emploi[0..@fin_emploi-1]
  			#récupérer indice du corps de l'agent dans progression sans emploi fonctionnel
  			@duree_emploi = params[:duree_emploif].to_i + @fin_emploi
  			@liste_indices = @liste_indices_emploi + @liste_indices[@duree_emploi-1..@duree_carriere-1]
  		else #emploi fonctionnel jusqu'à la fin
  			@liste_indices = @liste_indices_emploi[0..@duree_carriere-1]
  		end  		
  	end

  	#calcul si changement de grade 
  	if !params[:grade2].nil?
  		@annee_grade2 = params[:grade2].to_i
  		#prendre indice du corps de base au moment de la promotion et aller chercher le mm indice par valeur sup dans le grade au dessus 
  		@indice_anciengrade = @liste_indices[@annee_grade2-1]
  		@liste_indices_nouveau_grade = Grille.where(corps: params[:corps], grade: 2, type_emploi: "non fonctionnel").where("indice >= ?",@indice_anciengrade).order('indice ASC').pluck(:indice)
  		@liste_indices = @liste_indices[0..@annee_grade2-1]+@liste_indices_nouveau_grade[0..@duree_carriere-@annee_grade2-1]
  	end

  	if !params[:grade3].nil?
  		@annee_grade3 = params[:grade3].to_i
  		#prendre indice du corps de base au moment de la promotion et aller chercher le mm indice par valeur sup dans le grade au dessus 
  		@indice_anciengrade = @liste_indices[@annee_grade3-1]
  		@liste_indices_nouveau_grade = Grille.where(corps: params[:corps], grade: 3, type_emploi: "non fonctionnel").where("indice >= ?",@indice_anciengrade).order('indice ASC').pluck(:indice)
  		@liste_indices = @liste_indices[0..@annee_grade3-1]+@liste_indices_nouveau_grade[0..@duree_carriere-@annee_grade3-1]
  	end
  	if !params[:grade4].nil?
  		@annee_grade4 = params[:grade4].to_i
  		#prendre indice du corps de base au moment de la promotion et aller chercher le mm indice par valeur sup dans le grade au dessus 
  		@indice_anciengrade = @liste_indices[@annee_grade4-1]
  		@liste_indices_nouveau_grade = Grille.where(corps: params[:corps], grade: 4, type_emploi: "non fonctionnel").where("indice >= ?",@indice_anciengrade).order('indice ASC').pluck(:indice)
  		@liste_indices = @liste_indices[0..@annee_grade4-1]+@liste_indices_nouveau_grade[0..@duree_carriere-@annee_grade4-1]
  	end

  	@liste_indices= @liste_indices.collect { |n| (n * 56.2323).round(2) }
    @liste_indices = @liste_indices[0..@duree_carriere-1]

  	respond_to do |format|
          format.turbo_stream do 
            render turbo_stream: [
              turbo_stream.update('graphe', partial: "pages/graphe") 
            ]
          end         
    end 
  end 

  

  def import
  	Grille.import(params[:file])
  	respond_to do |format|
	  	format.turbo_stream {redirect_to root_path} 
	end
  end 
end
