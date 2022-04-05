# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_04_05_070954) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "emplois", force: :cascade do |t|
    t.string "duree"
    t.integer "echelon"
    t.float "indice"
    t.string "nom"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "annee"
  end

  create_table "grades", force: :cascade do |t|
    t.string "corps"
    t.integer "numero"
    t.string "nom"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "grilles", force: :cascade do |t|
    t.string "type_emploi"
    t.string "corps"
    t.integer "grade"
    t.integer "echelon"
    t.string "duree"
    t.float "indice"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "annee"
  end

  create_table "reclassements", force: :cascade do |t|
    t.integer "indice"
    t.integer "echelon"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
