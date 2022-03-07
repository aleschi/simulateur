class ChangeDureeToBeStringInGrilles < ActiveRecord::Migration[7.0]
  def change
  	change_column :grilles, :duree, :string
  	change_column :emplois, :duree, :string
  end
end
