class PagesController < ApplicationController
	protect_from_forgery with: :null_session
  def accueil
  end

  def index
  	@liste_indices = []
  	@liste_indices2 = []
    @liste_indices3 = []
    @array_ef=[]
    @array_grade=[]
  	if Grille.all.count > 0
  		@corps = Grille.where('corps != ?','AE').order('corps ASC').pluck(:corps).uniq
  	end
  	if Emploi.all.count > 0 
  		@emplois_f = ["Aucun"] + Emploi.all.order('created_at DESC').pluck(:nom).uniq
  		@emplois_f2 = Emploi.all.order('created_at DESC').pluck(:nom).uniq + ["Sous-préfet / sous-préfète", "Préfet / Préfète", "Fonctions diplomatiques", "Missions d'inspections générales","Emplois supérieurs de l'administration fiscale" ]
  	end
    @debut_dispo=0
    @fin_dispo=0
  end

  def mentions_legales
  end 
  
  def accessibilite
  end

  def donnees_personnelles
  end

  def select_filter
    #partie corps
    if !params[:corps].nil? && !params[:corps][0].nil? && params[:corps][0] != ""
  	
    #corps 
  	@corps = params[:corps][0]

  	#liste grades
  	grades = Grille.where(corps: @corps).order('grade ASC').pluck(:grade).uniq
  	max_grade = grades.last
    nom_grades = Grade.where(corps: @corps).order('numero ASC').pluck(:nom).uniq

    if max_grade > 4
      max_grade = 4
    end 

  	array = (2024..2072).to_a

  	  #grade selectionne
    	if !params[:grades].nil? && !params[:grades][0].nil? && params[:grades][0] != ""
  	  	grades = params[:grades][0].to_i	 

  		  #liste echelons
  	  	echelons = Grille.where(corps: @corps, grade: grades).order('echelon ASC').pluck(:echelon).uniq

  	  	#si echelon selectionne
  	  	if !params[:echelons].nil? && !params[:echelons][0].nil? && params[:echelons][0] != ""
  	  		echelons = params[:echelons][0]
  	  	end	  	

  	  	if !params[:grade2].nil? && !params[:grade2][0].nil? && params[:grade2][0] != ""
  	  		@start = params[:grade2][0].to_i + 1 #ne peut démarrer au min qu'un an apres promo du grade 2
  	  		array_grade3 = (@start..2072).to_a
  	  	elsif grades == 2
  	  		array_grade3 = array
        else
          array_grade3 = nil
  	  	end 

  	  	if !params[:grade3].nil? && !params[:grade3][0].nil? && params[:grade3][0] != ""
  	  		@start = params[:grade3][0].to_i + 1 #ne peut démarrer au min qu'un an apres promo du grade 2
  	  		array_grade4 = (@start..2072).to_a
  	  	elsif grades == 3
  	  		array_grade4 = array
        else 
          array_grade4 = nil
  	  	end
    	end
    else 
      nom_grades= nil
    end

  	if !params[:emploif].nil? && !params[:emploif][0].nil? && params[:emploif][0] != "Aucun" && params[:emploif][0] != ""
  		echelonsf = Emploi.where(nom: params[:emploif][0]).order('echelon ASC').pluck(:echelon).uniq
  	else
  		echelonsf = nil
  	end

  	if !params[:echelonf].nil? && !params[:echelonf][0].nil? && params[:echelonf][0] != ""
  		dureef = Emploi.where(nom: params[:emploif][0], echelon: params[:echelonf][0].to_i).where.not(duree: nil).order('indice ASC').pluck(:duree).uniq

  	else
  		dureef = nil
  	end


  	durees = Grille.where(corps: @corps, grade: grades, echelon: echelons).where.not(duree: nil).order('indice ASC').pluck(:duree).uniq

  	response = {grades: grades,nom_grades: nom_grades, max_grade: max_grade, echelons: echelons, durees: durees, array: array,array_grade3: array_grade3,array_grade4: array_grade4, 
  		echelonsf: echelonsf, dureef: dureef}
  	render json: response
  end
end
