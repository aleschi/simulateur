class AddAnneeToGrille < ActiveRecord::Migration[7.0]
  def change
    add_column :grilles, :annee, :integer
  end
end
