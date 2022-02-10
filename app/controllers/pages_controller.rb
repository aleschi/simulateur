class PagesController < ApplicationController
	protect_from_forgery with: :null_session
  def index
  	@liste_indices = []
  	if Grille.all.count > 0
  		@corps = Grille.all.pluck(:corps).uniq
  		@grades = Grille.where(corps: @corps[0]).pluck(:grade).uniq
  	end
  	if Emploi.all.count > 0 
  		@emplois_f = Emploi.all.pluck(:nom).uniq 
  	end
  end

  def mentions_legales
  end 
  
  def accessibilite
  end

  def donnees_personnelles
  end

  def select_filter
  	@corps = params[:corps][0]
  	grades = Grille.where(corps: @corps).pluck(:grade).uniq
  	max_grade = grades.last 
  	if !params[:grades][0].nil?
	  	grades = params[:grades][0]
	  	
	end
  	echelons = Grille.where(corps: @corps, grade: grades).pluck(:echelon).uniq

  	if !params[:echelons][0].nil?
  		echelons = params[:echelons][0]
  	end
  	array = (2022..2062).to_a

  	if !params[:grade2].nil?
  		@start = params[:grade2].to_i +1
  		array_grade3 = (@start..2062).to_a
  	else
  		array_grade3 = array
  	end 

  	if !params[:emploif].nil?
  		echelonsf = Emploi.where(nom: params[:emploif]).pluck(:echelon).uniq
  	else
  		echelonsf = nil
  	end

  	if !params[:echelonf].nil? && params[:echelonf].count > 0
  		@max_duree = Emploi.where(nom: params[:emploif], echelon: params[:echelonf][0].to_i).order('duree ASC').last.duree.to_i
  		dureef = (2022-@max_duree..2022).to_a
  	else
  		dureef = nil
  	end

  	if !params[:dureef].nil? && params[:dureef].count > 0
  		@max_duree = Emploi.where(nom: params[:emploif], echelon: params[:echelonf][0].to_i).order('duree ASC').last.duree.to_i
  		finf = (2022..params[:dureef][0].to_i+@max_duree).to_a
  	else
  		finf = nil
  	end

  	durees = Grille.where(corps: @corps, grade: grades, echelon: echelons).pluck(:duree).uniq
  	response = {grades: grades, echelons: echelons, durees: durees, array: array,array_grade3: array_grade3, max_grade: max_grade,
  		echelonsf: echelonsf, dureef: dureef, finf: finf}
  	render json: response
  end
end
