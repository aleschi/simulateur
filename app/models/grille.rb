class Grille < ApplicationRecord

	require 'roo'
  	require 'axlsx'

  	def self.import(file)
	    
  		Grille.destroy_all 
	  	xlsx = Roo::Spreadsheet.open(file.path)
	  	xlsx.each_with_pagename do |name, sheet|
		  	data = sheet
		    headers = data.row(1) # get header row		 
		    @corps = data.cell(2,1)
		  	data.each_with_index do |row, idx|
		    	next if idx == 0 # skip header
		      	row_data = Hash[[headers, row].transpose]
		      
				if !@corps.nil? && @corps != ""
		            @grille = Grille.new 
		            @grille.corps = @corps
		            @grille.grade = row_data["Grade"].to_i
		            @grille.duree = row_data["Durée"]
		            if row_data["Durée"] == " "
		            	@grille.duree = nil 
		            end 
		            @grille.mois = row_data["Mois"].to_i
		            @grille.annee = row_data["Année"].to_i  
		            @grille.echelon = row_data["Échelon"].to_i          
		            @grille.indice = row_data["IM"].to_f
		            @grille.grade_reclasse = row_data["Grade recl"].to_f
		            @grille.echelon_reclasse = row_data["Echelon recl"].to_f
		            @grille.anciennete = row_data["Anciennete_cons"].to_f
		            @grille.save
		        end
			end
		end
	end 
end
