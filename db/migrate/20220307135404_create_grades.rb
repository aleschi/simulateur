class CreateGrades < ActiveRecord::Migration[7.0]
  def change
    create_table :grades do |t|
      t.string :corps
      t.integer :numero
      t.string :nom

      t.timestamps
    end
  end
end
