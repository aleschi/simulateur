class PagesController < ApplicationController
	protect_from_forgery with: :null_session
  def index
  	@liste_indices = []
  	@liste_indices2 = []
  	if Grille.all.count > 0
  		@corps = Grille.all.pluck(:corps).uniq
  		@grades = Grille.where(corps: @corps[0]).pluck(:grade).uniq
  	end
  	if Emploi.all.count > 0 
  		@emplois_f = ["Aucun"] + Emploi.all.pluck(:nom).uniq 
  	end
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
  	grades = Grille.where(corps: @corps).pluck(:grade).uniq
  	max_grade = grades.last

  	array = (2022..2082).to_a

	#grade selectionne
  	if !params[:grades].nil? && !params[:grades][0].nil?
	  	grades = params[:grades][0]	  	
	

		#liste echelons
	  	echelons = Grille.where(corps: @corps, grade: grades).pluck(:echelon).uniq

	  	#si echelon selectionne
	  	if !params[:echelons].nil? && !params[:echelons][0].nil?
	  		echelons = params[:echelons][0]
	  	end	  	

	  	if !params[:grade2].nil? && !params[:grade2][0].nil?
	  		@start = params[:grade2][0].to_i + 2022 + 1 #ne peut démarrer au min qu'un an apres promo du grade 2
	  		array_grade3 = (@start..2082).to_a
	  	else
	  		array_grade3 = array
	  	end 

	  	if !params[:grade3].nil? && !params[:grade3][0].nil?
	  		@start = params[:grade3][0].to_i + 2022 + 1 #ne peut démarrer au min qu'un an apres promo du grade 2
	  		array_grade4 = (@start..2082).to_a
	  	else
	  		array_grade4 = array
	  	end
  	end

  	if !params[:emploif].nil? && !params[:emploif][0].nil? && !params[:emploif][0] != "Aucun"
  		echelonsf = Emploi.where(nom: params[:emploif][0]).pluck(:echelon).uniq
  	else
  		echelonsf = nil
  	end

  	if !params[:echelonf].nil? && !params[:echelonf][0].nil?
  		@max_duree = Emploi.where(nom: params[:emploif][0], echelon: params[:echelonf][0].to_i).order('duree ASC').last.duree.to_i
  		dureef = (1..@max_duree).to_a
  	else
  		dureef = nil
  	end

  	if !params[:dureef].nil? && !params[:dureef][0].nil?
  		@max_duree = Emploi.where(nom: params[:emploif], echelon: params[:echelonf][0].to_i).order('duree ASC').last.duree.to_i
  		finf = (2023..2023+@max_duree).to_a
  	else
  		finf = nil
  	end

  	durees = Grille.where(corps: @corps, grade: grades, echelon: echelons).pluck(:duree).uniq

  	response = {grades: grades, max_grade: max_grade, echelons: echelons, durees: durees, array: array,array_grade3: array_grade3,array_grade4: array_grade4, 
  		echelonsf: echelonsf, dureef: dureef, finf: finf}
  	render json: response
  end
end
