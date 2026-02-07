namespace :stripe do
  desc "Synchronize database plans with Stripe (creates Products and Prices if they don't exist)"
  task sync_plans: :environment do
    require 'stripe'
    Stripe.api_key = ENV['STRIPE_SECRET_KEY']

    if Stripe.api_key.blank?
      puts "Error: STRIPE_SECRET_KEY is not set in your environment."
      next
    end

    Plan.all.each do |plan|
      puts "Syncing plan: #{plan.name}..."

      # 1. Create or Find Product
      product = nil
      begin
        # Try to find by name or a specific metadata if we had it
        # For simplicity, we create a new one if IDs are missing
        product = Stripe::Product.create({
          name: "Laniakea - #{plan.name}",
          description: "Subscription plan for #{plan.name} at Laniakea",
          metadata: { plan_id: plan.id }
        })
        puts "  Created Product: #{product.id}"
      rescue => e
        puts "  Error creating product: #{e.message}"
        next
      end

      # 2. Create Monthly Price
      if plan.stripe_price_id.blank?
        begin
          price = Stripe::Price.create({
            unit_amount: plan.price_cents,
            currency: plan.currency.downcase,
            recurring: { interval: 'month' },
            product: product.id,
            metadata: { plan_id: plan.id, interval: 'monthly' }
          })
          plan.update!(stripe_price_id: price.id)
          puts "  Created Monthly Price: #{price.id}"
        rescue => e
          puts "  Error creating monthly price: #{e.message}"
        end
      else
        puts "  Monthly Price already exists: #{plan.stripe_price_id}"
      end

      # 3. Create Yearly Price (10% discount from the monthly * 12 used in frontend)
      if plan.stripe_yearly_price_id.blank?
        begin
          yearly_cents = (plan.price_cents * 12 * 0.9).round
          price_yearly = Stripe::Price.create({
            unit_amount: yearly_cents,
            currency: plan.currency.downcase,
            recurring: { interval: 'year' },
            product: product.id,
            metadata: { plan_id: plan.id, interval: 'yearly' }
          })
          plan.update!(stripe_yearly_price_id: price_yearly.id)
          puts "  Created Yearly Price: #{price_yearly.id}"
        rescue => e
          puts "  Error creating yearly price: #{e.message}"
        end
      else
        puts "  Yearly Price already exists: #{plan.stripe_yearly_price_id}"
      end
    end

    puts "Stripe synchronization complete!"
  end
end
