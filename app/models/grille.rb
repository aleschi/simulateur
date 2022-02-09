class Grille < ApplicationRecord

	require 'roo'
  	require 'axlsx'

  	def self.import(file)
	    #@grilles = Grille.all
	    #@grilles.destroy_all

	  	data = Roo::Spreadsheet.open(file.path)
	    headers = data.row(1) # get header row

	  	data.each_with_index do |row, idx|
	    	next if idx == 0 # skip header
	      	row_data = Hash[[headers, row].transpose]
	      
	        if !row_data["Corps"].nil? && !row_data["Corps"].blank? #on verifie que la colonne existe 

	            @grille = Grille.new 
	            @grille.corps = row_data["Corps"]
	            @grille.grade = row_data["Grade"].to_i
	            @grille.duree = row_data["Duree"].to_f   
	         	@grille.type_emploi = "non fonctionnel"
	            @grille.echelon = row_data["Echelon"].to_i          
	            @grille.indice = row_data["Indice"].to_i
	            @grille.save
	            
	        end
		end
	end 
end
