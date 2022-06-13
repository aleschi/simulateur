class AddGradeToReclassement < ActiveRecord::Migration[7.0]
  def change
    add_column :reclassements, :grade, :integer
  end
end
