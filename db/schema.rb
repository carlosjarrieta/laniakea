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

ActiveRecord::Schema[7.2].define(version: 2026_02_12_142928) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "name", null: false
    t.integer "account_type", default: 0, null: false
    t.string "billing_email"
    t.string "country_code", null: false
    t.string "currency_name"
    t.string "currency_symbol"
    t.string "address"
    t.string "postal_code"
    t.string "city"
    t.string "phone_number"
    t.string "stripe_customer_id"
    t.bigint "plan_id"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "tax_id"
    t.string "stripe_subscription_id"
    t.index ["plan_id"], name: "index_accounts_on_plan_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "ad_campaigns", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.integer "status", default: 0
    t.string "facebook_campaign_id"
    t.string "facebook_ad_set_id"
    t.string "facebook_ad_id"
    t.decimal "budget", precision: 10, scale: 2
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_ad_campaigns_on_campaign_id"
  end

  create_table "campaign_posts", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.string "platform"
    t.text "content"
    t.text "image_prompt"
    t.string "image_url"
    t.integer "status"
    t.jsonb "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "metrics"
    t.index ["campaign_id"], name: "index_campaign_posts_on_campaign_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.bigint "account_id", null: false
    t.integer "status"
    t.jsonb "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "daily_budget", precision: 10, scale: 2
    t.decimal "max_spend", precision: 10, scale: 2
    t.text "target_audience_description"
    t.index ["account_id"], name: "index_campaigns_on_account_id"
  end

  create_table "connected_accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "provider"
    t.string "uid"
    t.text "access_token"
    t.text "refresh_token"
    t.datetime "expires_at"
    t.string "name"
    t.string "image"
    t.jsonb "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_connected_accounts_on_user_id"
  end

  create_table "invitations", force: :cascade do |t|
    t.string "email"
    t.bigint "account_id", null: false
    t.integer "role"
    t.string "token"
    t.datetime "accepted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_invitations_on_account_id"
    t.index ["token"], name: "index_invitations_on_token"
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "account_id", null: false
    t.integer "role", default: 0, null: false
    t.integer "status", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_memberships_on_account_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "stripe_payment_intent_id"
    t.string "stripe_invoice_id"
    t.integer "amount_cents"
    t.string "currency"
    t.string "status"
    t.datetime "payment_date"
    t.jsonb "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_payments_on_account_id"
    t.index ["stripe_invoice_id"], name: "index_payments_on_stripe_invoice_id"
    t.index ["stripe_payment_intent_id"], name: "index_payments_on_stripe_payment_intent_id"
  end

  create_table "plans", force: :cascade do |t|
    t.string "name", null: false
    t.integer "price_cents", default: 0, null: false
    t.string "currency", default: "USD", null: false
    t.string "interval", default: "monthly", null: false
    t.jsonb "features", default: {}, null: false
    t.string "stripe_price_id"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "max_users", default: 1, null: false
    t.integer "max_social_profiles", default: 5, null: false
    t.integer "price_cents_yearly"
    t.string "stripe_yearly_price_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.integer "role", default: 0
    t.string "timezone", default: "UTC", null: false
    t.string "locale", default: "es", null: false
    t.string "name"
    t.string "theme_color", default: "zinc"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  add_foreign_key "accounts", "plans"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "ad_campaigns", "campaigns"
  add_foreign_key "campaign_posts", "campaigns"
  add_foreign_key "campaigns", "accounts"
  add_foreign_key "connected_accounts", "users"
  add_foreign_key "invitations", "accounts"
  add_foreign_key "memberships", "accounts"
  add_foreign_key "memberships", "users"
  add_foreign_key "payments", "accounts"
end
