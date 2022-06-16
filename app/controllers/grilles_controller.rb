class GrillesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!
  def index

  end
  
  def search_grilles
    #initialisation
    @fonctions = ["Sous-préfet / sous-préfète", "Préfet / Préfète", "Fonctions diplomatiques", "Missions d'inspections générales","Emplois supérieurs de l'administration fiscale" ]
  	@age = params[:age].to_i
  	@duree_carriere = 67 - @age
    @corps = params[:corps]
    @debut_dispo=0
    @fin_dispo=0
    if params[:debut_projet] != '' && params[:fin_projet] != ''
      @debut_dispo = params[:debut_projet].to_i
      @fin_dispo = params[:fin_projet].to_i
    end
    @grade = params[:grade].to_i
    @array_grade = Array.new(@duree_carriere, @grade)
    @array_ef = Array.new(@duree_carriere, 'non')
    @liste_indices_emploi = Array.new(@duree_carriere, 0) #courbe secondaire partie ef avant reforme 
    @liste_indices_emploi2 = Array.new(@duree_carriere, 0) #courbe secondaire partie ef apres reforme sans droit option 
    #@grade_max = @grade # grade max 3 pour table AE/reclassement ou ef

    #if @grade > 3 
    #  @grade_max = 3
    #end 
    @intervalle = 0
    #1/Courbe carriere principale (corps)

  	#liste indice corps de l'agent 
  	@annee_i = Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon], duree: params[:duree]).first.annee 
    @liste_grilles = Grille.where(corps: params[:corps], grade: params[:grade]).where("annee >= ?",@annee_i).order('annee ASC')
    @echelon_i = Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon], duree: params[:duree]).first.echelon
    @indice_i=Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon], duree: params[:duree]).first.indice
    @liste_indices=[@indice_i]
    @grade_reclasse = Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon], duree: params[:duree]).first.grade_reclasse
    @echelon_reclasse = Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon], duree: params[:duree]).first.echelon_reclasse
    
    SautLigne(@liste_grilles,@annee_i,@echelon_i,@corps,@grade,@liste_indices) #nouvelle liste d'indice supprimant les doublons dindice pour la même année (cases jaunes)
    
    @liste_indices2 = @liste_indices #courbe principale apres reforme pour traiter cas reduction anciennete

    #initialement dans un emploi fonctionnel 
    if !params[:type_emploi].nil? && params[:type_emploi] != "" && params[:type_emploi] != "Aucun" && params[:fin_emploif] != "" && params[:duree_emploif] != "" && params[:debut_emploif] != ""
      
      @duree_emploi = params[:fin_emploif].to_i - 2023 + 1 #duree jusqua fin emploi - on prend en compte 2023
      @duree = params[:duree_emploif] #duree echelon
      @array_ef = Array.new(@duree_emploi, params[:type_emploi])+@array_ef[@duree_emploi..@duree_carriere-1] #maj array ef pour graphe
      @duree_emploi_totale = params[:fin_emploif].to_i - 2023 + params[:debut_emploif].to_i

      #1ere courbe :avant reforme table emploi on prend premier indice correspondant et on fait defiler 
      @indice_emploi = Emploi.where(nom: params[:type_emploi], echelon: params[:echelon_emploif].to_i, duree: @duree).first.indice
      @annee_e = Emploi.where(nom: params[:type_emploi], echelon: params[:echelon_emploif].to_i, duree: @duree).first.annee
      @liste_e = Emploi.where(nom: params[:type_emploi]).where("annee >= ?",@annee_e).order('annee ASC')
      @echelon_e = Emploi.where(nom: params[:type_emploi], echelon: params[:echelon_emploif].to_i, duree: @duree).first.echelon
      @liste_indices_emploi_new = [@indice_emploi]
      SautLigneE(@liste_e,@annee_e,@echelon_e,params[:type_emploi],@liste_indices_emploi_new) #saut ligne cases jaunes -> nouvelles liste indice emplois      
      if @liste_indices_emploi_new.length < @duree_emploi #on complete pour avoir array de taille duree emploi
        @liste_indices_emploi_new = @liste_indices_emploi_new[0..@duree_emploi-1] + Array.new(@duree_emploi-liste_indices_emploi_new.length, @liste_indices_emploi_new.last)       
      end
      @liste_indices_emploi[0..@duree_emploi-1] = @liste_indices_emploi_new[0..@duree_emploi-1] #on initialise avec les donnees ef jusqua a la fin emploi f puis 0 partout
      
   
      #2eme courbe : on va chercher indice le plus proche au meme indice quil avait dans son emploi fonctionnel         
      #avant @liste_indices_ae = Grille.where(corps: "AE", grade: @grade_max).where('indice >= ?',@indice_emploi).order('indice ASC').pluck(:indice)
      @liste_indices_ae = Reclassement.where(grade: @grade_reclasse).where('indice >= ?',@indice_emploi).order('indice ASC').pluck(:indice)
      
      if !@liste_indices_ae.last.nil? #indice emploi f pas trop eleve pour grade table AE sinon pb      
        @liste_indices_moyenne_ae = Array.new(@duree_emploi, 0)
        ProgressionEf(@liste_indices_ae,@duree_emploi,@liste_indices_moyenne_ae)    
        @liste_indices_emploi2[0..@duree_emploi-1] = @liste_indices_moyenne_ae 
      end
    
      #3eme courbe: on va chercher indice le plus proche au meme indice quil avait dans son CORPS SANS EF dans table de reclassement puis on prend echelon correspondant et on fait derouler table jusqua a la fin
      #avant @nouvel_echelon = Reclassement.where('indice >= ?',@indice_i).order('indice ASC').first.echelon
      #avant @liste_indices_emploi3 = Grille.where(corps: "AE", grade: @grade_max).where('echelon >= ?',@nouvel_echelon).order('indice ASC').pluck(:indice)         
      @liste_indices_emploi3 = Reclassement.where(grade: @grade_reclasse).where('echelon >= ?',@echelon_reclasse).order('indice ASC').pluck(:indice)
      if @liste_indices_emploi3.last.nil? #indice emploi f trop eleve pour grade table AE
        @liste_indices_emploi3 = Array.new(@duree_carriere, @indice_emploi)  
      else
        @liste_indices_moyenne_ae3 = Array.new(@duree_emploi, 0)
        ProgressionEf(@liste_indices_emploi3,@duree_emploi,@liste_indices_moyenne_ae3) 
        @liste_indices_emploi3[0..@duree_emploi-1] = @liste_indices_moyenne_ae3   
        #on doit garder intervalle pour la suite 
        if @liste_indices_emploi3.length-@duree_emploi > 0
          @liste_indices_moyenne_ae3_suite = Array.new(@liste_indices_emploi3.length-@duree_emploi, 0)
          @intervalle = (2 * @duree_emploi).to_f/12
          ProgressionEfSuite(@liste_indices_emploi3,@duree_emploi,@liste_indices_moyenne_ae3_suite,@intervalle) 
          @liste_indices_emploi3[@duree_emploi..@liste_indices_emploi3.length-1] = @liste_indices_moyenne_ae3_suite
        end
      end

      #reduction anciennete si plus de 5 ans       
      if @duree_emploi_totale >= 5 && @duree_emploi_totale < @duree_carriere && @duree_emploi+1<@liste_indices2.length
        @liste_indices2 = @liste_indices2[0..@duree_emploi-1]+@liste_indices2[@duree_emploi+1..@liste_indices2.length-1]
      end

    else #nest pas dans un ef on calcule 3eme courbe 
      #@nouvel_echelon = Reclassement.where('indice >= ?',@indice_i).order('indice ASC').first.echelon
      #@liste_indices_emploi3 = Grille.where(corps: "AE", grade: @grade_max).where('echelon >= ?',@nouvel_echelon).order('indice ASC').pluck(:indice) 
      @liste_indices_emploi3 = Reclassement.where(grade: @grade_reclasse).where('echelon >= ?', @echelon_reclasse).order('indice ASC').pluck(:indice) 
    end


    #calcul si changement de grade 
    (2..4).each do |i|
      if !params["grade#{i}"].nil? && params["grade#{i}"] != '' 
        @grade = i
        @annee_grade = params["grade#{i}"].to_i - 2023 

        if @duree_carriere - @annee_grade > 0 #vérifie promo avant retraite
          #check dimension array vont jusqua promo de grade 
          @liste_indices=checkDim(@liste_indices,@annee_grade)
          @liste_indices2=checkDim(@liste_indices2,@annee_grade)
          @liste_indices_emploi3=checkDim(@liste_indices_emploi3,@annee_grade)
          @array_grade = @array_grade[0..@annee_grade-1] + Array.new(@duree_carriere-@annee_grade, @grade) #met a jour arr grade 
          
          #check projet de dispo de plus de 5 ans avant promotions de grade alors reset courbe principale 
          if @fin_dispo - @debut_dispo >= 5 && @fin_dispo < @annee_grade + 2023 && @array_grade[@fin_dispo-2023] == @grade-1 #verif avant le bon grade
            @liste_indices=Dispo(@debut_dispo,@fin_dispo,@liste_indices) 
            @liste_indices2=Dispo(@debut_dispo,@fin_dispo,@liste_indices2) 
            @liste_indices_emploi3=Dispo(@debut_dispo,@fin_dispo,@liste_indices_emploi3) 
          end 
         
          @liste_indices=PromoGrade(@corps,@grade,@liste_indices,@annee_grade)
          @liste_indices2=PromoGrade(@corps,@grade,@liste_indices2,@annee_grade)
          
          @liste_indices_emploi3=PromoGrade3(@liste_indices_emploi3,@annee_grade, @grade)
        
        end
      end
    end

    #check projet de dispo de plus de 5 ans apres dernière promotion de grade ou pas de promotions à venir alors reset courbe principale 
    if @fin_dispo - @debut_dispo >= 5 && (@array_grade[@debut_dispo-2023] == @grade || (params["grade2"] == '' || params["grade2"].nil?) && (params["grade3"] == '' || params["grade3"].nil?) && (params["grade4"] == '' || params["grade4"].nil?))
      @liste_indices=Dispo(@debut_dispo,@fin_dispo,@liste_indices) 
      @liste_indices2=Dispo(@debut_dispo,@fin_dispo,@liste_indices2) 
      @liste_indices_emploi3=Dispo(@debut_dispo,@fin_dispo,@liste_indices_emploi3) 
    end

    #nouvel emploi fonctionel  
    (1..6).each do |i|
      if !params["type_emploi#{i}"].nil? &&  params["type_emploi#{i}"] != "" && params["type_emploi#{i}"] != "Aucun" && params["duree_emploif#{i}"] != "" && params["debut_emploif#{i}"] != ""
        @duree_emploi = params["duree_emploif#{i}"].to_i 
        @start_emploi = params["debut_emploif#{i}"].to_i - 2023

        @array_ef = @array_ef[0..@start_emploi-1]+Array.new(@duree_emploi, params["type_emploi#{i}"])+@array_ef[@start_emploi+@duree_emploi..@duree_carriere-1]
 
        #avant reforme
        if @fonctions.include?(params["type_emploi#{i}"]) == false #ne contient pas les nouvelles fonctions         
          @liste_indices=checkDim(@liste_indices,@start_emploi)
          @i1=@liste_indices[@start_emploi-1]
          @i2=@liste_indices_emploi.max
          @indice_emploi = [@i1,@i2].max #max des indices
          @liste_indices_emploi_new = Emploi.where(nom: params["type_emploi#{i}"]).where("indice >= ?",@indice_emploi).order('indice ASC').pluck(:indice)          
          if !@liste_indices_emploi_new.last.nil?
          if @liste_indices_emploi_new.length < @duree_emploi
            @liste_indices_emploi_new = @liste_indices_emploi_new[0..@duree_emploi-1] + Array.new(@duree_emploi-@liste_indices_emploi_new.length, @liste_indices_emploi_new.last)
          end
          @liste_indices_emploi[@start_emploi..@start_emploi+@duree_emploi-1] = @liste_indices_emploi_new[0..@duree_emploi-1]            
          end
        end

        #apres reforme        
        @grade = @array_grade[@start_emploi-1]  #on regarde a quel grade on est a ce moment la   
        #if @grade > 3 #on bloque a 3 max pour grille AE
        #  @grade = 3
        #end 

        @liste_indices2=checkDim(@liste_indices2,@start_emploi)
        @i4=@liste_indices2[@start_emploi-1]
        @i3=@liste_indices_emploi2.max
        @indice_emploi_ae = [@i4,@i3].max
        #@liste_indices_emplois2_ae = Grille.where(corps: "AE", grade: @grade).where('indice >= ?',@indice_emploi_ae).order('indice ASC').pluck(:indice)
        @grade_reclasse = Grille.where(corps: params[:corps], grade: @grade, indice: @i4).first.grade_reclasse
        @liste_indices_emplois2_ae = Reclassement.where(grade: @grade_reclasse).where('indice >= ?',@indice_emploi_ae).order('indice ASC').pluck(:indice)
        
        if !@liste_indices_emplois2_ae.last.nil? #indice emploi f pas trop eleve pour grade table AE
          @liste_indices_emplois2_moyenne_ae = Array.new(@duree_emploi, 0)
          ProgressionEf(@liste_indices_emplois2_ae,@duree_emploi,@liste_indices_emplois2_moyenne_ae)
          @liste_indices_emploi2[@start_emploi..@start_emploi+@duree_emploi-1] =  @liste_indices_emplois2_moyenne_ae 
          if @fonctions.include?(params["type_emploi#{i}"]) == true #1ere courbe ef comme 2eme pour nouveau ef
            @liste_indices_emploi[@start_emploi..@start_emploi+@duree_emploi-1] = @liste_indices_emplois2_moyenne_ae 
          end
        end

        #apres reforme + droit option
        if @liste_indices_emploi3.length < @start_emploi+@duree_emploi+1
          @liste_indices_emploi3 = @liste_indices_emploi3[0..@start_emploi+@duree_emploi+1]+Array.new(@start_emploi+@duree_emploi+1-@liste_indices_emploi3.length, @liste_indices_emploi3.last)
        end
        
        
        @liste_indices_emplois3_moyenne_ae = Array.new(@duree_emploi, 0)
        #si promo de grade pendant ef 
        (2..4).each do |i|
            if !params["grade#{i}"].nil? && params["grade#{i}"] != ''              
              @annee_grade = params["grade#{i}"].to_i - 2023 
              if @annee_grade > @start_emploi && @annee_grade <= @start_emploi + @duree_emploi - 1
                @grade_a = i
                if @grade_a > 3
                  @grade_a=3
                end
                @promo = true 
                @liste_indices_emplois3_ae = @liste_indices_emploi3[@start_emploi..@liste_indices_emploi3.length-1]
                @liste_indices_emploi3[@start_emploi..@liste_indices_emploi3.length-1]=ProgressionEfGrade(@liste_indices_emplois3_ae,@duree_emploi,@liste_indices_emplois3_moyenne_ae,@grade_a, @annee_grade-@start_emploi)
              
              end
            end
        end
        if @promo.nil? #pas de promo pendant ef 
          @liste_indices_emplois3_ae = @liste_indices_emploi3[@start_emploi..@start_emploi+@duree_emploi]
          ProgressionEf(@liste_indices_emplois3_ae,@duree_emploi,@liste_indices_emplois3_moyenne_ae)
          @liste_indices_emploi3[@start_emploi..@start_emploi+@duree_emploi-1] = @liste_indices_emplois3_moyenne_ae  
        end      
        #suite après ef   
        if @liste_indices_emploi3.length-@start_emploi-@duree_emploi > 0
          @liste_indices_moyenne_ae3_suite = Array.new(@liste_indices_emploi3.length-@duree_emploi-@start_emploi, 0)
          @intervalle = (2 * @duree_emploi).to_f/12
          ProgressionEfSuite(@liste_indices_emploi3,@start_emploi+@duree_emploi,@liste_indices_moyenne_ae3_suite,@intervalle) 
          @liste_indices_emploi3[@start_emploi+@duree_emploi..@liste_indices_emploi3.length-1] = @liste_indices_moyenne_ae3_suite
        
          #si promo après ef garde intervalle du dernier ef 
          (2..4).each do |i|
            if !params["grade#{i}"].nil? && params["grade#{i}"] != ''           
              @annee_grade = params["grade#{i}"].to_i - 2023 
              if @annee_grade > @start_emploi + @duree_emploi
                @grade = i
                if @grade > 3
                  @grade=3
                end
                @liste_indices_emploi3=PromoGrade3(@liste_indices_emploi3,@annee_grade, @grade)
              end
            end
          end
        end  

        #reduction anciennete si plus de 5 ans et ne termine pas sur retraite
        if @duree_emploi >= 5 && (@start_emploi+@duree_emploi+1 < @duree_carriere) && @start_emploi+@duree_emploi+1 < @liste_indices2.length
          @liste_indices2 = @liste_indices2[0..@start_emploi+@duree_emploi-1]+@liste_indices2[@start_emploi+@duree_emploi+1..@liste_indices2.length-1]
        end
      end
    end

    @liste_indices=Dimarray(@liste_indices,@duree_carriere)
    @liste_indices2=Dimarray(@liste_indices2,@duree_carriere)
    @liste_indices_emploi=Dimarray(@liste_indices_emploi,@duree_carriere)
    @liste_indices_emploi2=Dimarray(@liste_indices_emploi2,@duree_carriere)
    @liste_indices_emploi3=Dimarray(@liste_indices_emploi3,@duree_carriere)
    

    @liste_indices = [@liste_indices, @liste_indices_emploi].transpose.map(&:max)
    @liste_indices2 = [@liste_indices2, @liste_indices_emploi2].transpose.map(&:max)
    @liste_indices3 = @liste_indices_emploi3

  	#@liste_indices= @liste_indices.collect { |n| (n * 56.2323).round(2) }


    if @corps == "Administrateur de l'Etat"
      @liste_indices2 = []
    end

  	respond_to do |format|
          format.turbo_stream do 
            render turbo_stream: [
              turbo_stream.update('graphe', partial: "pages/graphe") 
            ]
          end         
    end 
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
  def SautLigne(liste_grilles,annee_i,echelon_i,corps,grade,liste_indices)
    #saut de lignes dans grilles pour 1/2 echelon
    liste_grilles.each do |grille|
      #on prend année + 1 et on voit si il y a 2 lignes alors on prend echelon + 1
      if grille.annee == annee_i + 1
        if liste_grilles.where('annee = ?',grille.annee).count > 1
          @indice = Grille.where(corps: corps, grade: grade).where('annee = ? AND echelon = ?',grille.annee, echelon_i+1).first.indice
          echelon_i = echelon_i+1
          liste_indices << @indice
        else 
          liste_indices << grille.indice
          echelon_i = grille.echelon
        end
        annee_i = annee_i + 1
      end     
    end
  end
  def SautLigneE(liste_e,annee_e,echelon_e,nom,liste_indices_emploi_new)
  #saut de ligne si 2 echelons possible meme annee ex DP-EHN
      liste_e.each do |emploi|
        #on prend année + 1 et on voit si il y a 2 lignes alors on prend echelon + 1
        if emploi.annee == annee_e + 1
          if liste_e.where('annee = ?',emploi.annee).count > 1
            @indice = Emploi.where(nom: nom).where('annee = ? AND echelon = ?',emploi.annee, echelon_e+1).first.indice
            echelon_e = echelon_e+1
            liste_indices_emploi_new << @indice
          else 
            liste_indices_emploi_new << emploi.indice
            echelon_e = emploi.echelon
          end
          annee_e = annee_e + 1
        end     
      end
    end

    def ProgressionEf(liste_indices_ae,duree_emploi,liste_indices_moyenne_ae)
        if liste_indices_ae.length < duree_emploi + 1 #on prend @duree_emploi+1 car on a besoin du dernier indice pour la relation de recurrence
          liste_indices_ae = liste_indices_ae[0..duree_emploi] + Array.new(duree_emploi+1-liste_indices_ae.length, liste_indices_ae.last)
        end      
        liste_indices_ae[0..duree_emploi-1].each_with_index do |indice,i|
          #i demarre à 0
          liste_indices_moyenne_ae[i] = (((10-2*i)*liste_indices_ae[i]).to_f/12 + (2*(i+1)*liste_indices_ae[i+1]).to_f/12).round()
        end 
    end
    def ProgressionEfSuite(liste_indices_emploi3,duree_emploi,liste_indices_moyenne_ae3_suite,intervalle) 
          liste_indices_emploi3 = liste_indices_emploi3 + [liste_indices_emploi3.last] #on ajoute un indice supp à la fin 
          liste_indices_emploi3[duree_emploi..liste_indices_emploi3.length-2].each_with_index do |indice,i|
            #i demarre à 0
            liste_indices_moyenne_ae3_suite[i] = ((1-intervalle)*liste_indices_emploi3[duree_emploi+i] + intervalle*liste_indices_emploi3[duree_emploi+i+1]).round()
          end
    end 
    def Dispo(debut_dispo,fin_dispo,liste_indices) 
        @debut = debut_dispo - 2023
        @duree = fin_dispo-debut_dispo+1 
        liste_indices=checkDim(liste_indices,fin_dispo)
        @dernier_indice_5 = liste_indices[@debut+5-1]
        @liste_indices_bloque = Array.new(@duree-5, @dernier_indice_5)
        liste_indices = liste_indices[0..@debut+5-1] + @liste_indices_bloque + liste_indices[@debut+5..liste_indices.length-1+5-@duree]
        return liste_indices
    end

    def checkDim(liste,annee_grade)
      if liste.length < annee_grade
            liste = liste[0..annee_grade-1]+Array.new(annee_grade-liste.length,liste.last)
      end
      return liste
    end

    def PromoGrade(corps,grade,liste_indices,annee_grade)
          @indice_anciengrade = liste_indices[annee_grade]
          @count_indice = liste_indices[0..annee_grade].count(@indice_anciengrade)
          @liste_indices_nouveau_grade = Grille.where(corps: corps, grade: grade).where("indice >= ?",@indice_anciengrade).order('indice ASC').pluck(:indice)
          #si ancien indice plusieurs fois on decalle de la duree ou avait ancien indice       
          if @liste_indices_nouveau_grade.length < @count_indice + 1
            @liste_indices_nouveau_grade = @liste_indices_nouveau_grade[0..@count_indice]+ Array.new(@count_indice+1-@liste_indices_nouveau_grade.length, @liste_indices_nouveau_grade.last)
          end
          liste_indices = liste_indices[0..annee_grade-1]+@liste_indices_nouveau_grade[@count_indice-1..@liste_indices_nouveau_grade.length-1]
          return liste_indices
    end

    def PromoGrade3(liste_indices_emploi3,annee_grade, grade)
          @indice_anciengrade3 = liste_indices_emploi3[annee_grade]
          if grade <= 3 #max 3
            @liste_indices_nouveau_grade3 = Reclassement.where(grade: grade).where("indice >= ?",@indice_anciengrade3).order('indice ASC').pluck(:indice)
            #@liste_indices_emploi3 = @liste_indices_emploi3[0..@annee_grade-1]+@liste_indices_nouveau_grade3
            #garder intervalle
            @liste_indices_moyenne_ae3_suite = Array.new(@liste_indices_nouveau_grade3.length, 0)
            ProgressionEfSuite(@liste_indices_nouveau_grade3,0,@liste_indices_moyenne_ae3_suite,@intervalle) 
            liste_indices_emploi3[annee_grade..liste_indices_emploi3.length-1] = @liste_indices_moyenne_ae3_suite
          end
          return liste_indices_emploi3
    end

    def ProgressionEfGrade(liste_indices_ae,duree_emploi,liste_indices_moyenne_ae,grade,annee)
        if liste_indices_ae.length < duree_emploi + 1 #on prend @duree_emploi+1 car on a besoin du dernier indice pour la relation de recurrence
          liste_indices_ae = liste_indices_ae[0..duree_emploi] + Array.new(duree_emploi+1-liste_indices_ae.length, liste_indices_ae.last)
        end      
        liste_indices_ae[0..@duree_emploi-1].each_with_index do |indice,i|
          #i demarre à 0
          liste_indices_moyenne_ae[i] = (((10-2*i)*liste_indices_ae[i]).to_f/12 + (2*(i+1)*liste_indices_ae[i+1]).to_f/12).round()
          if i == annee-1
            @liste_indices_nouveau_grade3 = Reclassement.where(grade: grade).where("indice >= ?",liste_indices_moyenne_ae[i]).order('indice ASC').pluck(:indice)
            if @liste_indices_nouveau_grade3.length < duree_emploi - i - 1
              @liste_indices_nouveau_grade3=@liste_indices_nouveau_grade3[0..duree_emploi-i-2]+Array.new(duree_emploi-i-1-@liste_indices_nouveau_grade3.length,@liste_indices_nouveau_grade3.last)
            end 
            liste_indices_ae[i+1..liste_indices_ae.length-1] = @liste_indices_nouveau_grade3 #met à jour les suivants 
          end 
        end

        liste_indices_ae = liste_indices_moyenne_ae + liste_indices_ae[@duree_emploi..liste_indices_ae.length-1]
        return liste_indices_ae
    end
    
end
