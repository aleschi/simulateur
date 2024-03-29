class PagesController < ApplicationController
	protect_from_forgery with: :null_session
  before_action :authenticate_user!, :except => [:accueil]
  def accueil
  end

  def index
  	@liste_indices = []
    @liste_indices_annuel = []
  	@liste_indices2 = []
    @liste_indices2_annuel = []
    @liste_indices3 = []
    @liste_indices3_annuel = []
    @array_ef=[]
    @array_ef_annuel=[]
    @array_grade=[]
    @array_grade_annuel=[]
    @array_grade_reclasse=[]
    @array_grade_reclasse_annuel=[]
  	if Grille.all.count > 0
  		@corps = Grille.where('corps != ?','AE').order('corps ASC').pluck(:corps).uniq
  	end
  	if Emploi.all.count > 0 
  		#@emplois_f = ["Aucun"] + Emploi.all.order('created_at DESC').pluck(:nom).uniq
      @emplois_f =  Emploi.all.order('nom ASC').pluck(:nom).uniq + ["Sous-préfet / sous-préfète (au 1er Jan 2023)", "Préfet / Préfète (au 1er Jan 2023)", "Fonctions diplomatiques (au 1er Jan 2023)", "Missions d'inspections générales (au 1er Jan 2023)","Emplois supérieurs de l'administration fiscale (au 1er Jan 2023)" ]
  		@emplois_f2 = Emploi.all.order('nom ASC').pluck(:nom).uniq + ["Sous-préfet / sous-préfète", "Préfet / Préfète", "Fonctions diplomatiques", "Missions d'inspections générales","Emplois supérieurs de l'administration fiscale" ]
  	end
    @graphe_debut_dispo=0
    @graphe_fin_dispo=0
  end

  def mentions_legales
  end 
  
  def accessibilite
  end

  def donnees_personnelles
  end

  def select_filter
    @fonctions = ["Sous-préfet / sous-préfète", "Préfet / Préfète", "Fonctions diplomatiques", "Missions d'inspections générales","Emplois supérieurs de l'administration fiscale" ]
    #partie corps
    if !params[:corps].nil? && !params[:corps][0].nil? && params[:corps][0] != ""
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
  	  	echelons = Grille.where(corps: @corps, grade: grades).order('echelon ASC').pluck(:echelon).uniq

  	  	#si echelon selectionne
  	  	if !params[:echelons].nil? && !params[:echelons][0].nil? && params[:echelons][0] != ""
  	  		echelons = params[:echelons][0]
          @count_mois = Grille.where(corps: @corps, grade: grades, echelon: echelons).count
          @count_mois = [@count_mois, 48].min #max 4 ans
          durees = (1..@count_mois).to_a
        else
          durees = []
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

  	if !params[:emploif].nil? && !params[:emploif][0].nil? && params[:emploif][0] != "" && (@fonctions.include?(params[:emploif]) == false)
  		echelonsf = Emploi.where(nom: params[:emploif][0]).order('echelon ASC').pluck(:echelon).uniq
      niveauEf = Niveau.where(emploi: params[:emploif][0]).order(niveau: :asc).pluck(:niveau)
  	else
  		echelonsf = nil
      niveauEf = nil 
  	end

  	if !params[:echelonf].nil? && !params[:echelonf][0].nil? && params[:echelonf][0] != ""
      @count_mois = Emploi.where(nom: params[:emploif][0], echelon: params[:echelonf][0].to_i).count
      @count_mois = [@count_mois, 48].min #max 4 ans      
      dureeEf = (1..@count_mois).to_a
  	else
  		dureeEf = nil
  	end

  	response = {grades: grades,nom_grades: nom_grades, max_grade: max_grade, echelons: echelons, durees: durees, array: array,
      array_grade3: array_grade3,array_grade4: array_grade4, echelonsf: echelonsf, dureeEf: dureeEf, niveauEf: niveauEf}
  	render json: response
  end

  def select_niveau
    if !params[:emploi].nil? && params[:emploi] != ""
      niveauEf = Niveau.where(emploi: params[:emploi]).order(niveau: :asc).pluck(:niveau)
    else 
      niveauEf = nil 
    end 
    response = {niveauEf: niveauEf}
    render json: response

  end 

  def error_404
    if params[:path] && params[:path] == "500"
      render 'error_500'
    end 
  end 

  def error_500
      
  end 
end
