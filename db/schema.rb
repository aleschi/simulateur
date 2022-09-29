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

ActiveRecord::Schema[7.0].define(version: 2022_09_29_094529) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "emplois", force: :cascade do |t|
    t.string "duree"
    t.integer "echelon"
    t.float "indice"
    t.string "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "annee"
    t.integer "mois"
  end

  create_table "grades", force: :cascade do |t|
    t.string "corps"
    t.integer "numero"
    t.string "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "grilles", force: :cascade do |t|
    t.string "corps"
    t.integer "grade"
    t.integer "echelon"
    t.string "duree"
    t.float "indice"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "annee"
    t.float "grade_reclasse"
    t.integer "echelon_reclasse"
    t.integer "mois"
    t.integer "anciennete"
  end

  create_table "niveaus", force: :cascade do |t|
    t.string "emploi"
    t.integer "niveau"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reclassement_emplois", force: :cascade do |t|
    t.integer "indice_emploi"
    t.integer "indice_grade1"
    t.integer "indice_grade2"
    t.integer "indice_grade_transitoire"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reclassements", force: :cascade do |t|
    t.integer "indice"
    t.integer "echelon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "grade"
    t.integer "mois"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
