class CreateEmplois < ActiveRecord::Migration[7.0]
  def change
    create_table :emplois do |t|
      t.float :duree
      t.integer :echelon
      t.integer :indice
      t.string :nom

      t.timestamps
    end
  end
end
