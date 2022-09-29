class Niveau < ApplicationRecord
	require 'roo'
  	require 'axlsx'

  	def self.import(file)
  		Niveau.all.destroy_all
  		
	  	data = Roo::Spreadsheet.open(file.path)
	    headers = data.row(1) # get header row

	  	data.each_with_index do |row, idx|
	    	next if idx == 0 # skip header
	      	row_data = Hash[[headers, row].transpose]
	      
	        if !row_data["Emploi"].nil? && !row_data["Emploi"].blank? #on verifie que la colonne existe 

	            @niveau = Niveau.new 
	            
	            @niveau.emploi = row_data["Emploi"]
	            @niveau.niveau = row_data["Niveau"].to_i  
	            @niveau.save
	            
	        end
		end
	end 
end
