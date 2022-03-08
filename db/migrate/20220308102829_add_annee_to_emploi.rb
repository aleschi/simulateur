class AddAnneeToEmploi < ActiveRecord::Migration[7.0]
  def change
    add_column :emplois, :annee, :integer
  end
end
