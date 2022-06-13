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
	      
	        if !row_data["Indice"].nil? && !row_data["Indice"].blank? #on verifie que la colonne existe 

	            @reclassement = Reclassement.new 
	            @reclassement.echelon = row_data["Echelon"].to_i          
	            @reclassement.indice = row_data["Indice"].to_i
	            @reclassement.grade = row_data["Grade"].to_i
	           	@reclassement.save
	            
	        end
		end
	end 
end
