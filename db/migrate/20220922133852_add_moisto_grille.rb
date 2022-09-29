class AddMoistoGrille < ActiveRecord::Migration[7.0]
  def change
    add_column :grilles, :mois, :integer
    add_column :emplois, :mois, :integer
  end
end
