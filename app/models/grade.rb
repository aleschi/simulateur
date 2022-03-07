class Grade < ApplicationRecord

	require 'roo'
  	require 'axlsx'

  	def self.import(file)

	  	data = Roo::Spreadsheet.open(file.path)
	    headers = data.row(1) # get header row

	  	data.each_with_index do |row, idx|
	    	next if idx == 0 # skip header
	      	row_data = Hash[[headers, row].transpose]
	      
	        if !row_data["Corps"].nil? && !row_data["Corps"].blank? #on verifie que la colonne existe 

	            @grade = Grade.new 
	            
	            @grade.corps = row_data["Corps"]
	            @grade.numero = row_data["Numero"].to_i  
	            @grade.nom = row_data["Nom"]
	            
	            @grade.save
	            
	        end
		end
	end 

end
