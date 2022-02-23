class GrillesController < ApplicationController
  def index

  end
  
  def search_grilles
  	@age = params[:age].to_i
  	@duree_carriere = 67 - @age

    #1/Courbe carriere principale (corps)

  	#calcul indice initial dans le corps de l'agent
  	@indice_corps = Grille.where(corps: params[:corps], grade: params[:grade], echelon: params[:echelon], duree: params[:duree]).first.indice
  	
  	#liste indice corps de l'agent 
  	@liste_indices = Grille.where(corps: params[:corps], grade: params[:grade]).where("echelon > ? OR (echelon = ? AND duree >= ?)",params[:echelon],params[:echelon],params[:duree]).order('indice ASC').pluck(:indice)
  	if @liste_indices.length < @duree_carriere #on complete jusqua la retraite avec le dernier indice
      @liste_indices = @liste_indices[0..@duree_carriere-1] + Array.new(@duree_carriere-@liste_indices.length, @liste_indices.last)
    else #on prend uniquement les indices jusqua la retraite
      @liste_indices = @liste_indices[0..@duree_carriere-1]
    end
  	
  	#calcul si changement de grade 
    (2..4).each do |i|
    	if !params["grade#{i}"].nil? && params["grade#{i}"] != '' 
        #annee changement de grade
    		@annee_grade = params["grade#{i}"].to_i
        if @duree_carriere - @annee_grade > 0 #vérifie promo avant retraite
      		#prendre indice du corps de base année 1 an avant la promotion et aller chercher le mm indice par valeur sup dans le grade au dessus + echelon = duree annee a cet indice 
      		@indice_anciengrade = @liste_indices[@annee_grade-1]
          #depuis cb de temps a cet indice
          @count_indice = @liste_indices[0..@annee_grade-1].count(@indice_anciengrade)
      		@liste_indices_nouveau_grade = Grille.where(corps: params[:corps], grade: i).where("indice >= ?",@indice_anciengrade).order('indice ASC').pluck(:indice)
      		#si ancien indice plusieurs fois on decalle de la duree ou avait ancien indice
          if @liste_indices_nouveau_grade.length >= @duree_carriere - @annee_grade #assure bonne dimension array
            @liste_indices = @liste_indices[0..@annee_grade-1]+@liste_indices_nouveau_grade[@count_indice..@duree_carriere-1-@annee_grade+@count_indice]
          else
            @liste_indices = @liste_indices[0..@annee_grade-1]+@liste_indices_nouveau_grade[@count_indice..@duree_carriere-1-@annee_grade+@count_indice] +  Array.new(@duree_carriere-@annee_grade-@liste_indices_nouveau_grade.length, @liste_indices_nouveau_grade.last)
          end
        end
    	end
    end

    #2 calcul courbe secondaire 
    
    #avant reforme 
    @liste_indices_emploi = Array.new(@liste_indices.length, 0)
    #courbe apres reforme sans droit option pour partie emploi fonctionnel
    @liste_indices_emploi2 = Array.new(@liste_indices.length, 0)
    #initialement dans un emploi fonctionnaire
    if !params[:type_emploi].nil? && params[:type_emploi] != "" && params[:type_emploi] != "Aucun" && params[:fin_emploif] != "" && params[:duree_emploif] != ""
      @duree_emploi = params[:fin_emploif].to_i - 2022
      @duree = params[:duree_emploif].to_f
      
      #avant reforme
      @liste_indices_emploi_new = Emploi.where(nom: params[:type_emploi]).where("echelon > ? OR (echelon = ? AND duree >= ?)",params[:echelon_emploif],params[:echelon_emploif],@duree).order('indice ASC').pluck(:indice)
      #on initialise avec les donnees ef jusqua a la fin emploi f puis 0 partout
      if @liste_indices_emploi_new.length < @duree_emploi #on complete pour avoir array de taille duree emploi
        @liste_indices_emploi = @liste_indices_emploi_new[0..@duree_emploi-1] + Array.new(@duree_emploi-liste_indices_emploi_new.length, @liste_indices_emploi_new.last) + @liste_indices_emploi[@duree_emploi..@liste_indices.length-1] 
      else   
        @liste_indices_emploi = @liste_indices_emploi_new[0..@duree_emploi-1] + @liste_indices_emploi[@duree_emploi..@liste_indices.length-1]     
      end

      #calcul emploi fonctionnel avec réforme 
      #on va chercher indice le plus proche au meme indice quil avait dans son emploi fonctionnel
      @indice_emploi = Emploi.where(nom: params[:type_emploi], echelon: params[:echelon_emploif].to_i, duree: @duree).first.indice      
      @liste_indices_ae = Grille.where(corps: "AE", grade: params[:grade]).where('indice >= ?',@indice_emploi).order('indice ASC').pluck(:indice)
      if @liste_indices_ae.last.nil? #indice emploi f trop eleve pour grade table AE
        @liste_indices_ae = Array.new(@duree_emploi+1, @indice_emploi)
        @liste_indices_moyenne_ae = Array.new(@duree_emploi, @indice_emploi)
      else
        #on prendre @duree_emploi et pas @duree_emploi-1 car on a besoin du dernier indice pour la relation de recurrence
        if @liste_indices_ae.length >= @duree_emploi + 1
          @liste_indices_ae = @liste_indices_ae[0..@duree_emploi]
        else 
          @liste_indices_ae = @liste_indices_ae[0..@duree_emploi] + Array.new(@duree_emploi+1-@liste_indices_ae.length, @liste_indices_ae.last)
        end
        @liste_indices_moyenne_ae = Array.new(@duree_emploi, 0)
        @liste_indices_ae[0..@duree_emploi-1].each_with_index do |indice,i|
          #i demarre à 0
          @liste_indices_moyenne_ae[i] = (((10-2*i)*@liste_indices_ae[i]).to_f/12 + (2*(i+1)*@liste_indices_ae[i+1]).to_f/12).round()
        end
      end
      @liste_indices_emploi2 = @liste_indices_moyenne_ae + @liste_indices_emploi2[@duree_emploi..@liste_indices.length-1]  
    end

    #nouvel emploi fonctionel  
    (1..6).each do |i|
      if !params["type_emploi#{i}"].nil? &&  params["type_emploi#{i}"] != "" && params["type_emploi#{i}"] != "Aucun" && params["duree_emploif#{i}"] != "" && params["debut_emploif#{i}"] != ""
        @duree_emploi = params["duree_emploif#{i}"].to_i 
        @start_emploi = params["debut_emploif#{i}"].to_i - 2022
        #avant reforme
        #max des indices
        @i1=@liste_indices[@start_emploi-1]
        @i2=@liste_indices_emploi.max
        @indice_emploi = [@i1,@i2].max
        @liste_indices_emploi_new = Emploi.where(nom: params["type_emploi#{i}"]).where("indice >= ?",@indice_emploi).order('indice ASC').pluck(:indice)
         
        if @liste_indices_emploi_new.length < @duree_emploi
          @liste_indices_emploi_new = @liste_indices_emploi_new[0..@duree_emploi-1] + Array.new(@duree_emploi-@liste_indices_emploi_new.length, @indice_emploi)
        else 
          @liste_indices_emploi_new = @liste_indices_emploi_new[0..@duree_emploi-1]
        end
        if @start_emploi+@duree_emploi < @duree_carriere #retraite non dépassée 
          @liste_indices_emploi = @liste_indices_emploi[0..@start_emploi-1] + @liste_indices_emploi_new + @liste_indices_emploi[@start_emploi+@duree_emploi..@liste_indices.length-1]     
        else
          @liste_indices_emploi = @liste_indices_emploi[0..@start_emploi-1] + @liste_indices_emploi_new[0..@duree_carriere-@start_emploi-1] 
        end
        #apres reforme
        @i3=@liste_indices_emploi2.max
        @indice_emploi_ae = [@i1,@i3].max
        @liste_indices_emplois2_ae = Grille.where(corps: "AE", grade: params[:grade]).where('indice >= ?',@indice_emploi_ae).order('indice ASC').pluck(:indice)
        if @liste_indices_emplois2_ae.last.nil? #indice emploi f trop eleve pour grade table AE
          @liste_indices_emplois2_ae = Array.new(@duree_emploi+1, @indice_emploi_ae)
          @liste_indices_emplois2_moyenne_ae = Array.new(@duree_emploi, @indice_emploi_ae)
        else
          if @liste_indices_emplois2_ae.length >= @duree_emploi+1
            @liste_indices_emplois2_ae = @liste_indices_emplois2_ae[0..@duree_emploi]
          else
            @liste_indices_emplois2_ae = @liste_indices_emplois2_ae[0..@duree_emploi] + Array.new(@duree_emploi-@liste_indices_emplois2_ae.length,@liste_indices_emplois2_ae.last)
          end
          @liste_indices_emplois2_moyenne_ae = Array.new(@duree_emploi, 0)
          @liste_indices_emplois2_ae[0..@duree_emploi-1].each_with_index do |indice,i|
            @liste_indices_emplois2_moyenne_ae[i] = (((10-2*i)*@liste_indices_emplois2_ae[i]).to_f/12 + (2*(i+1)*@liste_indices_emplois2_ae[i+1]).to_f/12).round()
          end
        end
        if @start_emploi+@duree_emploi < @duree_carriere #retraite non dépassée 
          @liste_indices_emploi2 = @liste_indices_emploi2[0..@start_emploi-1] + @liste_indices_emplois2_moyenne_ae + @liste_indices_emploi2[@start_emploi+@duree_emploi..@liste_indices.length-1]
        else
          @liste_indices_emploi2 = @liste_indices_emploi2[0..@start_emploi-1] + @liste_indices_emplois2_moyenne_ae[0..@duree_carriere-@start_emploi-1]
        end
      end
    end

    @liste_indices = [@liste_indices, @liste_indices_emploi].transpose.map(&:max)
    @liste_indices2 = [@liste_indices, @liste_indices_emploi2].transpose.map(&:max)

  	#@liste_indices= @liste_indices.collect { |n| (n * 56.2323).round(2) }
    @liste_indices = @liste_indices[0..@duree_carriere-1]
    @liste_indices2 = @liste_indices2[0..@duree_carriere-1]

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
