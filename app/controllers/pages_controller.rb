class PagesController < ApplicationController
	protect_from_forgery with: :null_session
  def index
  	@liste_indices = []
  	if Grille.all.count > 0
  		@corps = Grille.all.pluck(:corps).uniq
  		@grades = Grille.where(corps: @corps[0]).pluck(:grade).uniq
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
  	if !params[:grades][0].nil?
	  	@grade = params[:grades][0]
	else
	  	@grade = grades
	end
  	echelons = Grille.where(corps: @corps, grade: @grade).pluck(:echelon).uniq

  	if !params[:echelons][0].nil?
  		@echelon = params[:echelons][0]
  	else
  		@echelon = echelons
  	end
  	durees = Grille.where(corps: @corps, grade: @grade, echelon: @echelon).pluck(:duree).uniq
  	response = {grades: grades, echelons: echelons, durees: durees}
  	render json: response
  end
end
