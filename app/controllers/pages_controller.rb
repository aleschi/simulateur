class PagesController < ApplicationController
	protect_from_forgery with: :null_session
  def index
  	@liste_indices = []
  	@liste_indices2 = []
    @liste_indices3 = []
  	if Grille.all.count > 0
  		@corps = Grille.where('corps != ?','AE').pluck(:corps).uniq
  	end
  	if Emploi.all.count > 0 
  		@emplois_f = ["Aucun"] + Emploi.all.pluck(:nom).uniq
  		@emplois_f2 = Emploi.all.pluck(:nom).uniq 
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
  	#corps 
  	@corps = params[:corps][0]

  	#liste grades
  	grades = Grille.where(corps: @corps).order('grade ASC').pluck(:grade).uniq
  	max_grade = grades.last

  	array = (2023..2072).to_a

	#grade selectionne
  	if !params[:grades].nil? && !params[:grades][0].nil? && !params[:grades][0] != ""
	  	grades = params[:grades][0].to_i	  	
	

		#liste echelons
	  	echelons = Grille.where(corps: @corps, grade: grades).order('echelon ASC').pluck(:echelon).uniq

	  	#si echelon selectionne
	  	if !params[:echelons].nil? && !params[:echelons][0].nil? && !params[:echelons][0] != ""
	  		echelons = params[:echelons][0]
	  	end	  	

	  	if !params[:grade2].nil? && !params[:grade2][0].nil? && params[:grade2][0] != ""
	  		@start = params[:grade2][0].to_i + 2022 + 1 #ne peut démarrer au min qu'un an apres promo du grade 2
	  		array_grade3 = (@start..2072).to_a
	  	elsif grades == 2
	  		array_grade3 = array
      else
        array_grade3 = nil
	  	end 

	  	if !params[:grade3].nil? && !params[:grade3][0].nil? && params[:grade3][0] != ""
	  		@start = params[:grade3][0].to_i + 2022 + 1 #ne peut démarrer au min qu'un an apres promo du grade 2
	  		array_grade4 = (@start..2072).to_a
	  	elsif grades == 3
	  		array_grade4 = array
      else 
        array_grade4 = nil
	  	end
  	end

  	if !params[:emploif].nil? && !params[:emploif][0].nil? && !params[:emploif][0] != "Aucun" && !params[:emploif][0] != ""
  		echelonsf = Emploi.where(nom: params[:emploif][0]).pluck(:echelon).uniq
  	else
  		echelonsf = nil
  	end

  	if !params[:echelonf].nil? && !params[:echelonf][0].nil? && !params[:echelonf][0] != ""
  		@max_duree = Emploi.where(nom: params[:emploif][0], echelon: params[:echelonf][0].to_i).order('duree ASC').last.duree.to_i
  		dureef = (1..@max_duree).to_a
  	else
  		dureef = nil
  	end


  	durees = Grille.where(corps: @corps, grade: grades, echelon: echelons).pluck(:duree).uniq

  	response = {grades: grades, max_grade: max_grade, echelons: echelons, durees: durees, array: array,array_grade3: array_grade3,array_grade4: array_grade4, 
  		echelonsf: echelonsf, dureef: dureef}
  	render json: response
  end
end
