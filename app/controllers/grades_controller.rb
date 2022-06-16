class GradesController < ApplicationController
	before_action :authenticate_user!
	def index
	end 
	def import
		
	  	Grade.import(params[:file])

	  	respond_to do |format|
		  	format.turbo_stream {redirect_to root_path} 
		end
	end
end
