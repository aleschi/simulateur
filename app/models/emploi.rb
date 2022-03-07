class Emploi < ApplicationRecord

	require 'roo'
  	require 'axlsx'

  	def self.import(file)

	  	data = Roo::Spreadsheet.open(file.path)
	    headers = data.row(1) # get header row

	    row2 = data.row(2)
	    row_data2 = Hash[[headers, row2].transpose]
	    Emploi.where('nom = ?',row_data2["Emploi"]).destroy_all

	  	data.each_with_index do |row, idx|
	    	next if idx == 0 # skip header
	      	row_data = Hash[[headers, row].transpose]
	      
	        if !row_data["Emploi"].nil? && !row_data["Emploi"].blank? #on verifie que la colonne existe 

	            @emploi = Emploi.new 
	            @emploi.nom = row_data["Emploi"]
	            @emploi.duree = row_data["Duree"]
	            if row_data["Duree"] == " " 
	            	@emploi.duree = nil
	            end
	            @emploi.echelon = row_data["Echelon"].to_i          
	            @emploi.indice = row_data["Indice"].to_i
	            
	            @emploi.save
	            
	        end
		end
	end 
end
