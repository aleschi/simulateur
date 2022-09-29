class ReclassementEmploi < ApplicationRecord
	require 'roo'
  	require 'axlsx'

  	def self.import(file)

  		ReclassementEmploi.destroy_all

	  	data = Roo::Spreadsheet.open(file.path)
	    headers = data.row(1) # get header row

	  	data.each_with_index do |row, idx|
	    	next if idx == 0 # skip header
	      	row_data = Hash[[headers, row].transpose]
	      
	        if !row_data["IM_ORIGINE"].nil? && !row_data["IM_ORIGINE"].blank? #on verifie que la colonne existe 

	            @reclassement = ReclassementEmploi.new 
	            @reclassement.indice_emploi = row_data["IM_ORIGINE"].to_i          
	            @reclassement.indice_grade1 = row_data["PREMIERGRADE_MAJORE"].to_i
	            @reclassement.indice_grade2 = row_data["DEUXIEMEGRADE_MAJORE"].to_i
	            @reclassement.indice_grade_transitoire = row_data["GRADETRANSITOIRE_MAJORE"].to_i
	           	@reclassement.save
	            
	        end
		end
	end 
end
