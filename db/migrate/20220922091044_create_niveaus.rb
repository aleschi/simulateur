class CreateNiveaus < ActiveRecord::Migration[7.0]
  def change
    create_table :niveaus do |t|
      t.string :emploi
      t.integer :niveau

      t.timestamps
    end
  end
end
