class AddAncienneteToGrille < ActiveRecord::Migration[7.0]
  def change
    add_column :grilles, :anciennete, :integer
  end
end
