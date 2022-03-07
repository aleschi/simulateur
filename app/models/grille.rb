class Grille < ApplicationRecord

	require 'roo'
  	require 'axlsx'

  	def self.import(file)
	    Grille.where(annee: nil).destroy_all

	  	data = Roo::Spreadsheet.open(file.path)
	    headers = data.row(1) # get header row
	    row2 = data.row(2)
	    row_data2 = Hash[[headers, row2].transpose]
	    Grille.where('corps = ?',row_data2["Corps"]).destroy_all 

	  	data.each_with_index do |row, idx|
	    	next if idx == 0 # skip header
	      	row_data = Hash[[headers, row].transpose]
	      
	        if !row_data["Corps"].nil? && !row_data["Corps"].blank? #on verifie que la colonne existe 

	            @grille = Grille.new 
	            @grille.corps = row_data["Corps"]
	            @grille.grade = row_data["Grade"].to_i
	            @grille.duree = row_data["Duree"]
	            if row_data["Duree"] == " "
	            	@grille.duree = nil 
	            end 
	            @grille.annee = row_data["Annee"].to_i  
	         	@grille.type_emploi = "non fonctionnel"
	            @grille.echelon = row_data["Echelon"].to_i          
	            @grille.indice = row_data["Indice"].to_i
	            @grille.save
	            
	        end
		end
	end 
end
