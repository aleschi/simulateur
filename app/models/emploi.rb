class Emploi < ApplicationRecord

	require 'roo'
  	require 'axlsx'

  	def self.import(file)
  		
	    Emploi.destroy_all
	    xlsx = Roo::Spreadsheet.open(file.path)
	  	xlsx.each_with_pagename do |name, sheet|
		  	data = sheet
		  	headers = data.row(1) # get header row
		  	@nom_emploi = data.cell(1,8)
		  	data.each_with_index do |row, idx|
		    	next if idx == 0 # skip header
		      	row_data = Hash[[headers, row].transpose]	      
		        if !@nom_emploi.nil? && !@nom_emploi.blank? #on verifie que la colonne existe 
		            @emploi = Emploi.new 
		            @emploi.nom = @nom_emploi
		            @emploi.annee = row_data["Année"].to_i	           
		            @emploi.duree = row_data["Durée"]
		            if row_data["Durée"] == " " 
		            	@emploi.duree = nil
		            end
		            @emploi.mois = row_data["Mois"].to_i 
		            @emploi.echelon = row_data["Échelon"].to_i          
		            @emploi.indice = row_data["IM"].to_f		            
		            @emploi.save		            
		        end
			end
		end
	end 
end
