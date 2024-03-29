class ReclassementsController < ApplicationController
	before_action :authenticate_user!
	protect_from_forgery with: :null_session

	def index 
	end 

	def import
		Reclassement.import(params[:file])

	  	respond_to do |format|
		  	format.turbo_stream {redirect_to root_path} 
		end
	end

	def import_emploi
		ReclassementEmploi.import(params[:file])

	  	respond_to do |format|
		  	format.turbo_stream {redirect_to root_path} 
		end
	end
end
