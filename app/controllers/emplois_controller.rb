class EmploisController < ApplicationController
	def index
	end 
	def import
	  	Emploi.import(params[:file])

	  	respond_to do |format|
		  	format.turbo_stream {redirect_to emplois_path} 
		end
	end
end
