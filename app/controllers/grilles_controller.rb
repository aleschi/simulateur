class GrillesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!
  def index

  end
  
  def search_grilles
    #initialisation des paramètres 
    @fonctions = ["Sous-préfet / sous-préfète", "Préfet / Préfète", "Fonctions diplomatiques", "Missions d'inspections générales","Emplois supérieurs de l'administration fiscale" ]
  	@age = params[:age].to_i
  	@duree_carriere = (67 - @age + 1)*12 #en mois     
    @debut_dispo=0
    @fin_dispo=0
    @graphe_debut_dispo = 0
    @graphe_fin_dispo = 0
    if params[:debut_projet] != '' && params[:fin_projet] != ''
      @debut_dispo = params[:debut_projet].to_i-2023
      @fin_dispo = params[:fin_projet].to_i-2023
      @graphe_debut_dispo = params[:debut_projet].to_i
      @graphe_fin_dispo = params[:fin_projet].to_i
    end
    @corps = params[:corps]
    @grade = params[:grade].to_i
    @echelon = params[:echelon].to_i 
    @mois = params[:duree].to_i
    @annee_depart = Grille.where(corps: @corps, grade: @grade, echelon: @echelon).pluck(:annee).uniq.min
    @mois_depart = Grille.where(corps: @corps, grade: @grade, echelon: @echelon, annee: @annee_depart).pluck(:mois).min #peut etre diff de 1
    @annee_i = ((@mois_depart-1+@mois-1)/12).to_i + Grille.where(corps: @corps, grade: @grade, echelon: @echelon).pluck(:annee).uniq.min #placer à ligne bonne annee    
    @mois_i = @mois_depart-1+@mois-12*((@mois_depart-1+@mois-1)/12).to_i #mois/12 donne entier 
    @ligne_i = Grille.where(corps: @corps, grade: @grade, echelon: @echelon, annee: @annee_i, mois: @mois_i).first
    @grade_reclasse = @ligne_i.grade_reclasse
    @echelon_reclasse = @ligne_i.echelon_reclasse

    @array_grade = Array.new(@duree_carriere, @grade) #pour suivre le grade à chaque instant
    @array_ef = Array.new(@duree_carriere, 'non')
    [params[:grade2].to_i,params[:grade3].to_i,params[:grade4].to_i].each_with_index do |date_grade, i|
      if date_grade != 0
        @array_grade = @array_grade[0..(date_grade-2023)*12-1] + Array.new(@duree_carriere-(date_grade-2023)*12, i+2) #met a jour arr grade  
      end 
    end
    
    @liste_indices_emploi = Array.new(@duree_carriere, 0) #courbe secondaire partie ef avant reforme 
    @liste_indices_emploi2 = Array.new(@duree_carriere, 0) #courbe secondaire partie ef apres reforme sans droit option 

    @liste_indices = CarrierePrincipale1(@duree_carriere, @corps, @grade, @echelon, @annee_i, @mois_i, params[:grade2].to_i, params[:grade3].to_i, params[:grade4].to_i,@debut_dispo, @fin_dispo,@array_grade)    
    @liste_indices2 = CarrierePrincipale2(@duree_carriere, @corps, @grade,@echelon, @annee_i, @mois_i, params[:grade2].to_i, params[:grade3].to_i, params[:grade4].to_i,@debut_dispo, @fin_dispo, params[:type_emploi], params[:niveau_emploi].to_i, params[:debut_emploif].to_i, params[:fin_emploif].to_i,@array_grade )

    #initialement dans un emploi fonctionnel 
    if !params[:type_emploi].nil? && params[:type_emploi] != "" && params[:niveau_emploi] != "" && params[:echelon_emploif] != "" && params[:fin_emploif] != "" && params[:duree_echelonf] != "" && params[:debut_emploif] != ""  
      @duree_emploi = (params[:fin_emploif].to_i - 2023)*12 #duree jusqua fin emploi 
      @array_ef[0..@duree_emploi-1] = Array.new(@duree_emploi, params[:type_emploi]) #maj array ef pour graphe   
      @annee_e = ((params[:duree_echelonf].to_i-1)/12).to_i+Emploi.where(nom: params[:type_emploi], echelon: params[:echelon_emploif].to_i).pluck(:annee).min
      @mois_e = params[:duree_echelonf].to_i-12*((params[:duree_echelonf].to_i-1)/12).to_i
      @indice_e = Emploi.where(nom: params[:type_emploi], echelon: params[:echelon_emploif].to_i, annee: @annee_e, mois: @mois_e).first.indice
      @indice_final = [@indice_e,@liste_indices[0]].max#prendre max entre indice emploi et indice carriere principal 
      @anciennete_2 = [18,params[:duree_echelonf].to_i].min
      @liste_indices_emploi = EmploiFonctionnel1(@liste_indices_emploi, params[:type_emploi],params[:echelon_emploif].to_i, params[:duree_echelonf].to_i, 0, @duree_emploi, nil, nil, 0)     
      @liste_indices_emploi2 = EmploiFonctionnel2(@liste_indices_emploi2, params[:grade].to_i, @indice_final,@grade_reclasse, params[:niveau_emploi].to_i, 0, @duree_emploi, @duree_carriere, @anciennete_2)
    
    end
    
    #nouvel emploi fonctionel  
    (1..6).each do |i|
      if !params["type_emploi#{i}"].nil? &&  params["type_emploi#{i}"] != "" && params["duree_emploif#{i}"] != "" && params["debut_emploif#{i}"] != "" && params["niveau_emploi#{i}"] != ""
        @duree_emploi = params["duree_emploif#{i}"].to_i*12 
        @start_emploi = (params["debut_emploif#{i}"].to_i - 2023)*12
        @array_ef = @array_ef[0..@start_emploi-1]+Array.new(@duree_emploi, params["type_emploi#{i}"])+@array_ef[@start_emploi+@duree_emploi..@duree_carriere-1]
        
        #courbe 2       
        @grade = @array_grade[@start_emploi-1]  #on regarde a quel grade on est mois avant prise de ef  
        @indice1 = @liste_indices2[@start_emploi-1] #indice carriere principale mois avant prise de ef 
        @indice2=@liste_indices_emploi2.max #indice max de ef 
        @indice = [@indice1,@indice2].max #max des indices
        @count_anciennete = @liste_indices_emploi2.count(@indice) 
        @grade_reclasse_ef = Grille.where(corps: @corps, grade: @grade, indice: @indice1).first.grade_reclasse #grade reclassé à la ligne du corps principal au moment de l'ef
        @liste_indices_emploi2 = EmploiFonctionnel2(@liste_indices_emploi2, @grade, @indice,@grade_reclasse_ef, params["niveau_emploi#{i}"].to_i, @start_emploi, @duree_emploi, @duree_carriere, @count_anciennete)

        #courbe 1
        if @fonctions.include?(params["type_emploi#{i}"]) == false #ne contient pas les nouvelles fonctions         
          @i1=@liste_indices[@start_emploi-1] #indice année avant la prise d'emploi
          @i2=@liste_indices_emploi.max
          @indice_emploi = [@i1,@i2].max #max des indices
          @indice_emploi = [@indice_emploi, Emploi.where(nom: params["type_emploi#{i}"]).pluck(:indice).max()].min #aller chercher dans la table emploi max si indice trop grand
          @count = @liste_indices_emploi.count(@indice_emploi) #si max correspond a ef alors on reprend lanciennete sinon 0
          @liste_indices_emploi = EmploiFonctionnel1(@liste_indices_emploi, nil,nil, nil, @start_emploi, @duree_emploi, params["type_emploi#{i}"], @indice_emploi, @count)            
        else 
          #courbe 1 = courbe 2 
          @liste_indices_emploi[@start_emploi..@start_emploi+@duree_emploi] = @liste_indices_emploi2[@start_emploi..@start_emploi+@duree_emploi] 
        end

      end
    end

    @array_grade_reclasse = Array.new(@duree_carriere, 0) #pour suivre le grade à chaque instant
    @liste_indices_emploi3 = Courbe3(@duree_carriere, @corps, params[:grade].to_i, params[:echelon].to_i, params[:duree].to_i, params[:type_emploi], params[:niveau_emploi].to_i, params[:echelon_emploif].to_i, params[:duree_echelonf].to_i, params[:debut_emploif].to_i,params[:fin_emploif].to_i, params[:grade2].to_i, @debut_dispo, @fin_dispo, @array_grade_reclasse)
    
    if @liste_indices_emploi3 == false #pb indice trop haut simu impossible 
      redirect_to simulation_impossible_path 
    else 

    @liste_indices=Dimarray(@liste_indices,@duree_carriere)
    @liste_indices2=Dimarray(@liste_indices2,@duree_carriere)
    @liste_indices_emploi=Dimarray(@liste_indices_emploi,@duree_carriere)
    @liste_indices_emploi2=Dimarray(@liste_indices_emploi2,@duree_carriere)
    @liste_indices_emploi3=Dimarray(@liste_indices_emploi3,@duree_carriere)
    

    @liste_indices = [@liste_indices, @liste_indices_emploi].transpose.map(&:max)
    @liste_indices_annuel = @liste_indices.select.with_index{|x,i| i%12 == 0}

    @liste_indices2 = [@liste_indices2, @liste_indices_emploi2].transpose.map(&:max)
    @liste_indices2_annuel = @liste_indices2.select.with_index{|x,i| i%12 == 0}
    
    @liste_indices3 = @liste_indices_emploi3
    @liste_indices3_annuel = @liste_indices3.select.with_index{|x,i| i%12 == 0}

  	#@liste_salaire= @liste_indices.collect { |n| (n * 56.2323).round(2) }


    if @corps == "Administrateur / Administratrice de l’Etat"
      @liste_indices2 = []
      @liste_indices2_annuel =  []
    end

    @array_grade_annuel = @array_grade.select.with_index{|x,i| i%12 == 0}
    @array_ef_annuel = @array_ef.select.with_index{|x,i| i%12 == 0}
    @array_grade_reclasse_annuel = @array_grade_reclasse.select.with_index{|x,i| i%12 == 0}

  	respond_to do |format|
          format.turbo_stream do 
            render turbo_stream: [
              turbo_stream.update('graphe', partial: "pages/graphe"),
              turbo_stream.update('table', partial: "pages/table")  
            ]
          end         
    end 

    end #end liste 3 non null
  end 

  def supp
    #Grille.destroy_all
    
    redirect_to root_path
  end

  def import
    Grille.import(params[:file])
  	respond_to do |format|
	  	format.turbo_stream {redirect_to grilles_path} 
	 end
  end 

  private
    def Dimarray(liste_indices,duree_carriere)
      if liste_indices.length >= duree_carriere
        liste_indices = liste_indices[0..duree_carriere-1]
      else 
        liste_indices = liste_indices[0..duree_carriere-1]+ Array.new(duree_carriere-liste_indices.length,liste_indices.last)
      end 
      return liste_indices
    end

    def checkDim(liste,min_duree)
      if liste.length < min_duree
            liste = liste[0..min_duree-1]+Array.new(min_duree-liste.length,liste.last)
      end
      return liste
    end

    def CarrierePrincipale1(duree_carriere, corps, grade, echelon, annee_i, mois_i, grade2, grade3, grade4, debut_dispo, fin_dispo,array_grade)    
      @liste_indices = Grille.where(corps: corps, grade: grade).where("(echelon = ? AND annee = ? AND mois >= ?) OR (echelon = ? AND annee > ?) OR echelon > ?",echelon,annee_i, mois_i, echelon, annee_i, echelon).order('indice ASC').pluck(:indice)      
      @liste_indices= checkDim(@liste_indices,duree_carriere) #dim liste indice jusqu'à fin carrière 
      @liste_indices = CheckPromo(@liste_indices,duree_carriere,grade2,grade3,grade4,0,duree_carriere, corps, grade, debut_dispo,fin_dispo, array_grade) #check promo + dispo       
      return @liste_indices
    end

    def EmploiFonctionnel1(liste_indices_emploi, type_emploi,echelon, duree_echelon, start, duree_emploi, emploi_futur, indice, count)
      #1ere courbe :avant reforme table emploi on prend premier indice correspondant et on fait defiler 
      if !type_emploi.nil?
        @annee_e = ((duree_echelon.to_i-1)/12).to_i + Emploi.where(nom: type_emploi, echelon: echelon).pluck(:annee).uniq.min #se placer à la bonne année 
        @mois_e = duree_echelon.to_i-12*((duree_echelon-1)/12).to_i #se placer au bon mois 
        @liste_indices_emploi_new = Emploi.where(nom: type_emploi).where("(echelon = ? AND annee = ? AND mois >= ?) OR (echelon = ? AND annee > ?) OR echelon > ?",echelon,@annee_e,@mois_e, echelon, @annee_e, echelon).order('indice ASC').pluck(:indice)
      elsif !emploi_futur.nil?
        @liste_indices_emploi_new = Emploi.where(nom: emploi_futur).where('indice >= ?', indice).order('indice ASC').pluck(:indice)
        @liste_indices_emploi_new = checkDim(@liste_indices_emploi_new, count + 1) #dim va jusqua count  
        @liste_indices_emploi_new = @liste_indices_emploi_new[count..@liste_indices_emploi_new.length-1] #decallage anciennete a indice 
      end 
      @liste_indices_emploi_new = checkDim(@liste_indices_emploi_new, duree_emploi) # avoir array de taille duree emploi
      liste_indices_emploi[start..start+duree_emploi-1] = @liste_indices_emploi_new[0..duree_emploi-1] #on initialise avec les donnees ef jusqua a la fin emploi f puis 0 partout
      return liste_indices_emploi
    end 

    def CarrierePrincipale2(duree_carriere, corps, grade, echelon, annee_i, mois_i, grade2, grade3, grade4, debut_dispo, fin_dispo, type_emploi, niveau_emploi, debut_emploi, fin_emploi, array_grade)
      @liste_indices2 = Grille.where(corps: corps, grade: grade).where("(echelon = ? AND annee = ? AND mois >= ?) OR (echelon = ? AND annee > ?) OR echelon > ?",echelon,annee_i, mois_i, echelon, annee_i, echelon).order('indice ASC').pluck(:indice)      
      @liste_indices2 = checkDim(@liste_indices2,duree_carriere) #dim liste indice jusqu'à fin carrière 
      if !type_emploi.nil? && type_emploi != ""
        @bonification2 = Bonification2(niveau_emploi) #bonif en sortie de tout ef
        @duree_emploi = (fin_emploi - 2023)*12        
        @liste_indices2 = CheckPromo(@liste_indices2,duree_carriere,grade2,grade3,grade4,0,@duree_emploi, corps, grade, 0,0, array_grade) #check si promo de grade avant fin de ef + pas de dispo avant ef                   
        @liste_indices2 = @liste_indices2[0..@duree_emploi-1] + @liste_indices2[@duree_emploi+@bonification2..@liste_indices2.length-1]
        @liste_indices2 = checkDim(@liste_indices2,duree_carriere) #dim liste indice jusqu'à fin carrière         
      end  
      
      (1..6).each do |i| #promo grade avant ef et bonification pour carriere principale à la fin des ef
        if !params["type_emploi#{i}"].nil? &&  params["type_emploi#{i}"] != "" && params["duree_emploif#{i}"] != "" && params["debut_emploif#{i}"] != "" && params["niveau_emploi#{i}"] != "" 
          @duree_emploi = params["duree_emploif#{i}"].to_i*12 
          @start_emploi = (params["debut_emploif#{i}"].to_i - 2023)*12
          @bonif = Bonification2(params["niveau_emploi#{i}"])
          @liste_indices2 = CheckPromo(@liste_indices2,duree_carriere,grade2,grade3,grade4,@start_emploi,@duree_emploi, corps, grade, debut_dispo,fin_dispo,array_grade) #si promo avant ef          
          @liste_indices2 = @liste_indices2[0..@duree_emploi+@start_emploi-1] + @liste_indices2[@start_emploi+@duree_emploi+@bonif..@liste_indices2.length-1]
          @liste_indices2 = checkDim(@liste_indices2,duree_carriere) #dim liste indice jusqu'à fin carrière 
        end
      end
      
      #promo de grade si pas de ef ou apres dernier ef 
      if params["type_emploi1"].nil? || params["type_emploi1"] == "" || (!@start_emploi.nil? && (grade2 >= @start_emploi + @duree_emploi || grade3 >= @start_emploi + @duree_emploi || grade4 >= @start_emploi + @duree_emploi)) 
        @liste_indices2 = CheckPromo(@liste_indices2,duree_carriere,grade2,grade3,grade4,0,duree_carriere, corps, grade, debut_dispo,fin_dispo,array_grade)          
      end 

      @liste_indices2 = checkDim(@liste_indices2,duree_carriere) #dim liste indice jusqu'à fin carrière 
      return @liste_indices2
    end
    
    def EmploiFonctionnel2(liste_indices_emploi, grade,indice, grade_reclasse2, niveau, start, duree_emploi, duree_carriere, anciennete)

      #2eme courbe : on va chercher indice le plus proche à indice max avec grade reclassé 
      #indice = [indice,Reclassement.where(grade: grade_reclasse2).pluck(:indice).max].min #si jamais indice emploi plus grand que dernier indice dans table de reclassement   
      indice = [indice,Reclassement.where(grade: 2).pluck(:indice).max].min
      @liste_indices_ae = Reclassement.where(grade: 2).where('indice >= ?',indice).order('indice ASC').pluck(:indice)     
      @liste_indices_ae = @liste_indices_ae[anciennete..@liste_indices_ae.length-1]
      @liste_indices_ae = checkDim(@liste_indices_ae,duree_carriere)
    
      @liste_indices_moyenne_ae = [] #liste des indice avec progression accelerée
      if niveau == 3
        while @liste_indices_moyenne_ae.length <= duree_emploi
        @liste_indices_ae.each_with_index do |indice,i|
          if i.modulo(18) != 16 && i.modulo(18) != 17
            @liste_indices_moyenne_ae << indice
          end         
        end 
        end 
      elsif niveau == 2
        while @liste_indices_moyenne_ae.length <= duree_emploi
        @liste_indices_ae.each_with_index do |indice,i|
          if i.modulo(18) != 16 && i.modulo(18) != 17 && i.modulo(18) != 15 && i.modulo(18) != 14
            @liste_indices_moyenne_ae << indice
          end         
        end 
        end
      elsif niveau == 1
        while @liste_indices_moyenne_ae.length <= duree_emploi
        @liste_indices_ae.each_with_index do |indice,i|
          if i.modulo(18) != 16 && i.modulo(18) != 17 && i.modulo(18) != 15 && i.modulo(18) != 14 && i.modulo(18) != 13 && i.modulo(18) != 12
            @liste_indices_moyenne_ae << indice
          end         
        end 
        end
      else 
        @liste_indices_moyenne_ae = @liste_indices_ae
      end
      liste_indices_emploi[start..start+duree_emploi-1] = @liste_indices_moyenne_ae[0..duree_emploi-1] 
      return liste_indices_emploi
    end

    def CheckPromo(liste_indices,duree_carriere,grade2,grade3,grade4,start_emploi,duree_emploi, corps, grade,debut_dispo,fin_dispo, array_grade)
      @new_grade = 0
      [grade2,grade3,grade4].each_with_index do |date_grade, i|
        if date_grade > 0 && (date_grade.to_i - 2023)*12 < start_emploi + duree_emploi #check promo avant fin de ef ou avant fin de carriere si pas de ef 
          @new_grade = i+2
          @annee_grade = (date_grade.to_i - 2023)*12        
          if fin_dispo - debut_dispo > 5 && fin_dispo < @annee_grade && array_grade[fin_dispo] == @new_grade-1 #check projet de dispo de plus de 5 ans avant promotions de grade alors reset courbe principale 
            liste_indices = Dispo(debut_dispo,fin_dispo,liste_indices, duree_carriere) 
          end 
          grade = @new_grade
          liste_indices = PromoGrade(corps,@new_grade,liste_indices,@annee_grade,duree_carriere)
        end
      end     
      if fin_dispo - debut_dispo > 5 && (@new_grade == 0 || @new_grade == array_grade[debut_dispo]) #dispo si aucune promo de grade ou apres derniere promo de grade
        @liste_indices = Dispo(debut_dispo,fin_dispo,@liste_indices, duree_carriere) 
      end  
      liste_indices = checkDim(liste_indices,duree_carriere)
      return liste_indices
    end 

    def PromoGrade(corps,grade,liste_indices,annee_grade, duree_carriere)
      @indice_anciengrade = liste_indices[annee_grade] #indice qu'il aurait normalement si pas de promo de grade 
      @liste_indices_nouveau_grade = Grille.where(corps: corps, grade: grade).where("indice >= ?",@indice_anciengrade).order('indice ASC').pluck(:indice)     
      @count_indice = liste_indices[0..annee_grade].count(@indice_anciengrade) #si ancien indice plusieurs fois on decalle de la duree ou avait ancien indice      
      @liste_indices_nouveau_grade = checkDim(@liste_indices_nouveau_grade,duree_carriere)     
      liste_indices = liste_indices[0..annee_grade-1]+@liste_indices_nouveau_grade[@count_indice-1..@liste_indices_nouveau_grade.length-1]
      liste_indices = checkDim(liste_indices,duree_carriere)
      return liste_indices
    end

    def Courbe3(duree_carriere, corps, grade, echelon,duree, type_emploi, niveau_emploi,echelon_emploi, duree_echelon, debut_emploi,fin_emploi, date_grade2, debut_dispo, fin_dispo, array_grade_reclasse )     
      #3eme courbe: on va chercher indice le plus proche au meme indice quil avait dans son CORPS SANS EF dans table de reclassement puis on prend echelon correspondant et on fait derouler table jusqua a la fin       
      @annee_depart = Grille.where(corps: corps, grade: grade, echelon: echelon).pluck(:annee).uniq.min
      @mois_depart = Grille.where(corps: corps, grade: grade, echelon: echelon, annee: @annee_depart).pluck(:mois).min
      @annee_i = ((@mois_depart-1+duree-1)/12).to_i + Grille.where(corps: corps, grade: grade, echelon: echelon).pluck(:annee).uniq.min #placer à ligne bonne annee    
      @mois_i = @mois_depart-1+duree-12*((@mois_depart-1+duree-1)/12).to_i #mois/12 donne entier 
      @ligne_i = Grille.where(corps: corps, grade: grade, echelon: echelon, annee: @annee_i, mois: @mois_i).first
      @indice_i = @ligne_i.indice
      @grade_reclasse = @ligne_i.grade_reclasse
      @echelon_reclasse = @ligne_i.echelon_reclasse
      @anciennete = @ligne_i.anciennete
      array_grade_reclasse[0..duree_carriere-1] = Array.new(duree_carriere, @grade_reclasse)
      
      @counter_temps_niveau1 = 0 
      @date_niveau1 = 0 #année au bout de laquelle atteint les 10 ans en niveau 1 
      
      if !type_emploi.nil? && type_emploi != "" #SI EF initial 
        @annee_e = ((duree_echelon-1)/12).to_i+Emploi.where(nom: type_emploi, echelon: echelon_emploi).pluck(:annee).min
        @mois_e = duree_echelon-12*((duree_echelon-1)/12).to_i
        @indice_e = Emploi.where(nom: type_emploi, echelon: echelon_emploi, annee: @annee_e, mois: @mois_e).first.indice       
        @indice_final = [@indice_e, @indice_i].max
        #ancienete emploi max 18 mois 
        @anciennete_recl = [18, duree_echelon].min 
        #on va chercher indice reclassé
        if @grade_reclasse == 1 
          @indice_e_reclasse = ReclassementEmploi.where('indice_emploi >= ?', @indice_final).order(indice_emploi: :asc).first.indice_grade1
        elsif @grade_reclasse == 2
          @indice_e_reclasse = ReclassementEmploi.where('indice_emploi >= ?', @indice_final).order(indice_emploi: :asc).first.indice_grade2
        else
          @indice_e_reclasse = ReclassementEmploi.where('indice_emploi >= ?', @indice_final).order(indice_emploi: :asc).first.indice_grade_transitoire
        end 
        @liste_indices_emploi3 = Reclassement.where(grade: @grade_reclasse).where('indice >= ?',@indice_e_reclasse).order('indice ASC').pluck(:indice)
        if @liste_indices_emploi3.count == 0 #pas dindice sup a cet indice dans table de reclassement         
          return false
        end

        @liste_indices_emploi3 = @liste_indices_emploi3[@anciennete_recl..@liste_indices_emploi3.length-1]
        @liste_indices_emploi3 = checkDim(@liste_indices_emploi3,duree_carriere)   
        @duree_emploi = (fin_emploi.to_i - 2023)*12
      
        if @grade_reclasse == 1 && date_grade2 != 0 && date_grade2 < fin_emploi #si promo au grade 2 pendant ef / autre promo pas possible car min 10 ans pour grade 3 
          @annee_grade = (date_grade2 - 2023)*12
          array_grade_reclasse[0..duree_carriere] = array_grade_reclasse[0..@annee_grade-1] + Array.new(duree_carriere-@annee_grade, 2)
          @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, niveau_emploi, @annee_grade, 0,duree_carriere ) #progression acceleree jusqua promo de grade 
          @liste_indices_emploi3 = PromoGrade3(duree_carriere, @liste_indices_emploi3,date_grade2,2)
          @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, niveau_emploi, @duree_emploi-@annee_grade, @annee_grade,duree_carriere )#progression acceleree de promo de grade à fin emploi
        else 
          @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, niveau_emploi, @duree_emploi, 0,duree_carriere ) #pas de promo pendant ef 
        end
      else #reclassement à partir de indice dans le corps si pas ef + anciennete
        @liste_indices_emploi3 = Reclassement.where(grade: @grade_reclasse).where('echelon >= ?',@echelon_reclasse).order('indice ASC').pluck(:indice)
        @liste_indices_emploi3 = @liste_indices_emploi3[@anciennete..@liste_indices_emploi3.length-1]
        @liste_indices_emploi3 = checkDim(@liste_indices_emploi3,duree_carriere)   
      end
     
      #si ef futurs 
      (1..6).each do |i|
        if !params["type_emploi#{i}"].nil? &&  params["type_emploi#{i}"] != "" && params["duree_emploif#{i}"] != "" && params["debut_emploif#{i}"] != "" && params["niveau_emploi#{i}"] != ""
          @duree_emploi = params["duree_emploif#{i}"].to_i*12 
          @start_emploi = (params["debut_emploif#{i}"].to_i - 2023)*12
          @end = 0 
          # progression accelerée pendant ef uniquement            
          if @grade_reclasse == 1 && date_grade2 != 0 && date_grade2 < @start_emploi + @duree_emploi # si promo de grade 2 avant/pendant 
            @annee_grade = (date_grade2 - 2023)*12
            array_grade_reclasse[0..duree_carriere] = array_grade_reclasse[0..@annee_grade-1] + Array.new(duree_carriere-@annee_grade, 2)
            if date_grade2 <=  @start_emploi   #promo avant ef
              if fin_dispo - debut_dispo > 5 && fin_dispo < date_grade2 && debut_dispo > @end #check projet de dispo de plus de 5 ans avant promotions de grade et avant ef (mais apres dernier ef)
                liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,liste_indices_emploi3, duree_carriere) 
              end           
              @liste_indices_emploi3 = PromoGrade3(duree_carriere, @liste_indices_emploi3,date_grade2,2) #promo avant progression dans ef 
              if fin_dispo - debut_dispo > 5 &&  debut_dispo > date_grade2 && fin_dispo < @start_emploi  #apres promo de grade avant ef 
                liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,@liste_indices_emploi3,duree_carriere) 
              end 
              @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, params["niveau_emploi#{i}"].to_i, @duree_emploi, @start_emploi,duree_carriere  )
              
            elsif @start_emploi < date_grade2 < @start_emploi + @duree_emploi #promo pendant ef / pas de dispo possible apres promo mais avant uniquement
              
              if fin_dispo - debut_dispo > 5 && fin_dispo < date_grade2 && debut_dispo > @end #check projet de dispo de plus de 5 ans avant promotions de grade et avant ef (mais apres dernier ef)
                liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,liste_indices_emploi3,duree_carriere) 
              end  
              @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, params["niveau_emploi#{i}"].to_i, @annee_grade-@start_emploi, @start_emploi,duree_carriere ) #progression acceleree jusqua promo de grade 
              @liste_indices_emploi3 = PromoGrade3(duree_carriere, @liste_indices_emploi3,date_grade2,2)
              @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, params["niveau_emploi#{i}"].to_i, @duree_emploi-@annee_grade, @annee_grade,duree_carriere )#progression acceleree de promo de grade à fin emploi     
            end 
          elsif params["niveau_emploi#{i}"].to_i == 1 && @counter_temps_niveau1 <= 120 && @counter_temps_niveau1 + @duree_emploi > 120 #promo grade 3 au bout de 10 ans de niveau 1 donc pendant ef                          
              
              @date_niveau1 = (12*10)-@counter_temps_niveau1 #duree en mois pour atteindre promo          
              array_grade_reclasse[0..duree_carriere] = array_grade_reclasse[0..@start_emploi+@date_niveau1-1] + Array.new(duree_carriere-@date_niveau1-@start_emploi, 3)    
              if fin_dispo - debut_dispo > 5 && fin_dispo < @start_emploi && debut_dispo > @end#check si dispo avant 
                @liste_indices_emploi3=Dispo(debut_dispo,fin_dispo,@liste_indices_emploi3,duree_carriere) 
              end 
              @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, params["niveau_emploi#{i}"].to_i, @date_niveau1, @start_emploi,duree_carriere ) #progression acceleree jusqua promo de grade 
              @liste_indices_emploi3 = PromoGrade3(duree_carriere, @liste_indices_emploi3,@start_emploi+@date_niveau1,3)
              @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, params["niveau_emploi#{i}"].to_i, @duree_emploi-@date_niveau1, @start_emploi+@date_niveau1,duree_carriere )#progression acceleree de promo de grade à fin emploi                    
          else  #pas de promo avant debut emploi ni pendant 
            if fin_dispo - debut_dispo > 5 && fin_dispo < @start_emploi && debut_dispo > @end #si dispo avant ef 
              @liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,@liste_indices_emploi3,duree_carriere) 
            end 
            @liste_indices_emploi3 = ProgressionAcceleree(@liste_indices_emploi3, params["niveau_emploi#{i}"].to_i, @duree_emploi, @start_emploi,duree_carriere )   
          end
          @end = @start_emploi + @duree_emploi
        end
      end

      if !@start_emploi.nil? 
        @end = @start_emploi
      else
        @end = 0 
      end       
   
      if @grade_reclasse == 1 && date_grade2 != 0 && date_grade2 > @end  # si promo de grade 2 si pas de ef ou si derriere dernier ef 
        if fin_dispo - debut_dispo > 5 && fin_dispo < date_grade2 && debut_dispo > @end #verif si dispo avant promo de grade
          @liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,@liste_indices_emploi3,duree_carriere) 
        end
        array_grade_reclasse[0..duree_carriere] = array_grade_reclasse[0..(date_grade2 - 2023)*12-1] + Array.new(duree_carriere-(date_grade2 - 2023)*12, 2)           
        @liste_indices_emploi3 = PromoGrade3(duree_carriere, @liste_indices_emploi3,date_grade2,2)    
        if fin_dispo - debut_dispo > 5 && debut_dispo > date_grade2 #verif si dispo apres promo de grade
          @liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,@liste_indices_emploi3,duree_carriere) 
        end  
      elsif date_grade2 == 0  && (params["type_emploi1"].nil? || params["type_emploi1"] == "")#pas de promo et pas d ef 
        
        if fin_dispo - debut_dispo > 5
          @liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,@liste_indices_emploi3,duree_carriere) 
        end    
      elsif fin_dispo - debut_dispo > 5 && debut_dispo > @end && @end > 0 && date_grade2 == 0 #check si dispo apres dernier ef sans promo 
        @liste_indices_emploi3 = Dispo(debut_dispo,fin_dispo,@liste_indices_emploi3,duree_carriere)
      end  
     
      return @liste_indices_emploi3
      
    end

    def ProgressionAcceleree(liste_indice, niveau, duree_emploi, start, duree_carriere)
      @liste_indices_moyenne_ae = [] #liste des indice avec progression accelerée
      @indice_decalle = 0
      if niveau == 3
        @indice_decalle = duree_emploi + 2*(duree_emploi/16)
        while @liste_indices_moyenne_ae.length < duree_emploi
        liste_indice[start..liste_indice.length-1].each_with_index do |indice,i|
          
          if i.modulo(18) != 16 && i.modulo(18) != 17
            @liste_indices_moyenne_ae << indice
          end         
        end 
        end
     
      elsif niveau == 2
        @indice_decalle = duree_emploi + 4*(duree_emploi/14)
        while @liste_indices_moyenne_ae.length < duree_emploi
        liste_indice[start..liste_indice.length-1].each_with_index do |indice,i|
          
          if i.modulo(18) != 16 && i.modulo(18) != 17 && i.modulo(18) != 15 && i.modulo(18) != 14
            @liste_indices_moyenne_ae << indice
          end         
        end 
        end
     
      elsif niveau == 1
        @indice_decalle = duree_emploi + 6*(duree_emploi/12)
        @counter_temps_niveau1 += duree_emploi 
        while @liste_indices_moyenne_ae.length < duree_emploi
        liste_indice[start..liste_indice.length-1].each_with_index do |indice,i|         
          if i.modulo(18) != 16 && i.modulo(18) != 17 && i.modulo(18) != 15 && i.modulo(18) != 14 && i.modulo(18) != 13 && i.modulo(18) != 12
            @liste_indices_moyenne_ae << indice
          end         
        end 
        end
      else 
        @indice_decalle = duree_emploi 
        @liste_indices_moyenne_ae = liste_indice[start..liste_indice.length-1]
      end
      @liste_indices_moyenne_ae = checkDim(@liste_indices_moyenne_ae, duree_emploi)
      liste_indice[start..liste_indice.length-1] = @liste_indices_moyenne_ae[0..duree_emploi-1] + liste_indice[start+@indice_decalle..liste_indice.length-1]
      liste_indice = checkDim(liste_indice,duree_carriere )
      return liste_indice
    end

    def PromoGrade3(duree_carriere, liste_indices_emploi3,date, grade)
      if grade == 2
        @annee_grade = (date - 2023)*12        
      else
        @annee_grade = date
      end
        @indice_sans_promo = liste_indices_emploi3[@annee_grade]
        @liste_grade2 = Reclassement.where(grade: grade).where('indice >= ?',@indice_sans_promo).order('indice ASC').pluck(:indice)
        @liste_grade2 = checkDim(@liste_grade2,duree_carriere-@annee_grade)
        liste_indices_emploi3[@annee_grade..liste_indices_emploi3.length] = @liste_grade2   
        return liste_indices_emploi3
    end

    def Bonification2(niveau)
      if niveau == 1
        @bonification = 4
      elsif niveau == 2
        @bonification = 2
      elsif niveau == 3
        @bonification = 1
      else
        @bonification = 0
      end 
      return @bonification
    end

    def Dispo(debut_dispo,fin_dispo,liste_indices,duree_carriere) 
        @debut = debut_dispo*12
        @duree = (fin_dispo-debut_dispo)*12 
        @dernier_indice_5 = liste_indices[@debut+5*12-1] #indice en décembre de l'annee avant 5 ans 
        @liste_indices_bloque = Array.new(@duree-5*12, @dernier_indice_5)
        liste_indices = liste_indices[0..@debut+5*12-1] + @liste_indices_bloque + liste_indices[@debut+5*12..liste_indices.length]
        liste_indices = checkDim(liste_indices,duree_carriere)
        return liste_indices
    end

end
