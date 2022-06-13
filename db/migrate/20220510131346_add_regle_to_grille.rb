class AddRegleToGrille < ActiveRecord::Migration[7.0]
  def change
    add_column :grilles, :grade_reclasse, :integer
    add_column :grilles, :echelon_reclasse, :integer
    remove_column :grilles, :type_emploi
  end
end
