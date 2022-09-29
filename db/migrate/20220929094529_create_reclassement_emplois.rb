class CreateReclassementEmplois < ActiveRecord::Migration[7.0]
  def change
    create_table :reclassement_emplois do |t|
      t.integer :indice_emploi
      t.integer :indice_grade1
      t.integer :indice_grade2
      t.integer :indice_grade_transitoire

      t.timestamps
    end
  end
end
