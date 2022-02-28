class CreateReclassements < ActiveRecord::Migration[7.0]
  def change
    create_table :reclassements do |t|
      t.integer :indice
      t.integer :echelon

      t.timestamps
    end
  end
end
