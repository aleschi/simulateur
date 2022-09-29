class Reclassement < ApplicationRecord

	require 'roo'
  	require 'axlsx'

  	def self.import(file)

  		Reclassement.destroy_all

	  	data = Roo::Spreadsheet.open(file.path)
	    headers = data.row(1) # get header row

	  	data.each_with_index do |row, idx|
	    	next if idx == 0 # skip header
	      	row_data = Hash[[headers, row].transpose]
	      
	        if !row_data["IM"].nil? && !row_data["IM"].blank? #on verifie que la colonne existe 

	            @reclassement = Reclassement.new 
	            @reclassement.echelon = row_data["Echelon"].to_i          
	            @reclassement.indice = row_data["IM"].to_i
	            @reclassement.grade = row_data["Grade"].to_f
	            @reclassement.mois = row_data["Mois"].to_i
	           	@reclassement.save
	            
	        end
		end
	end 
end
