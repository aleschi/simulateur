class CreateGrilles < ActiveRecord::Migration[7.0]
  def change
    create_table :grilles do |t|
      t.string :type_emploi
      t.string :corps
      t.integer :grade
      t.integer :echelon
      t.float :duree
      t.integer :indice

      t.timestamps
    end
  end
end
