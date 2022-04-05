class ChangeIndiceToBeFloat < ActiveRecord::Migration[7.0]
  def change
  	change_column :grilles, :indice, :float
  	change_column :emplois, :indice, :float
  end
end
