class ChangeGradeToBeFloatInReclassements < ActiveRecord::Migration[7.0]
  def change
  	change_column :reclassements, :grade, :float 
  	change_column :grilles, :grade_reclasse, :float 
  end
end
