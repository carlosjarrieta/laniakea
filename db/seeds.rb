# Reset Database using Truncate
puts "Resetting database..."
tables = ['memberships', 'accounts', 'plans', 'users', 'active_storage_attachments', 'active_storage_blobs', 'active_storage_variant_records']
tables.each do |table|
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE #{table} RESTART IDENTITY CASCADE")
end

# Create Initial Plans
puts "Creating plans..."
plans = [
  {
    name: 'Starter',
    price_cents: 1900,
    currency: 'USD',
    interval: 'monthly',
    max_users: 1,
    max_social_profiles: 5,
    features: {
      post_multiplier: 2,
      ai_generation: true,
      analytics: 'basic',
      support: 'email',
      storage_gb: 5
    }
  },
  {
    name: 'Professional',
    price_cents: 4900,
    currency: 'USD',
    interval: 'monthly',
    max_users: 5,
    max_social_profiles: 15,
    features: {
      post_multiplier: 5,
      ai_generation: true,
      analytics: 'advanced',
      support: 'priority',
      storage_gb: 20
    }
  },
  {
    name: 'Enterprise',
    price_cents: 14900,
    currency: 'USD',
    interval: 'monthly',
    max_users: 25,
    max_social_profiles: 100,
    features: {
      post_multiplier: 'unlimited',
      ai_generation: true,
      analytics: 'real-time',
      support: 'dedicated',
      storage_gb: 100
    }
  }
]

created_plans = plans.map do |plan_data|
  Plan.create!(plan_data)
end

# Create Superadmin User
superadmin_email = ENV['SUPERADMIN_EMAIL'] || 'admin@laniakea.ai'
superadmin_password = ENV['SUPERADMIN_PASSWORD'] || 'password123'

User.find_or_create_by!(email: superadmin_email) do |u|
  u.name = "Super Administrator"
  u.password = superadmin_password
  u.password_confirmation = superadmin_password
  u.role = :superadmin
  u.confirmed_at = Time.current
end
puts "Superadmin created: #{superadmin_email}"

# Create 10 Test Accounts
puts "Creating 10 test accounts..."
company_names = [
  "Acme Digital", "Horizon Labs", "Nebula Systems", "Solaris Media", "Vortex AI",
  "Pioneer Tech", "Quantum Marketing", "Titan Solutions", "Apex Studio", "Nova Agency"
]

10.times do |i|
  plan = created_plans.sample
  owner = User.create!(
    name: "User #{i+1}",
    email: "user#{i+1}@example.com",
    password: 'password123',
    password_confirmation: 'password123',
    role: :advertiser,
    confirmed_at: Time.current
  )

  account = Account.create!(
    name: company_names[i],
    plan: plan,
    status: [:active, :trialing, :past_due, :canceled].sample,
    country_code: 'US',
    billing_email: owner.email
  )

  # Create membership
  Membership.create!(
    user: owner,
    account: account,
    role: :admin,
    status: :active
  )
end

puts "Seed completed successfully!"
