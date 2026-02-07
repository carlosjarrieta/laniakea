module Superadmin
  class PlansController < BaseController
    before_action :set_plan, only: [:show, :update, :destroy]

    def index
      @plans = Plan.all
      render json: @plans
    end

    def show
      render json: @plan
    end

    def create
      @plan = Plan.new(plan_params)
      if @plan.save
        render json: @plan, status: :created
      else
        render json: @plan.errors, status: :unprocessable_entity
      end
    end

    def update
      if @plan.update(plan_params)
        render json: @plan
      else
        render json: @plan.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @plan.update(active: false)
      head :no_content
    end

    private

    def set_plan
      @plan = Plan.find(params[:id])
    end

    def plan_params
      params.require(:plan).permit(:name, :price_cents, :price_cents_yearly, :currency, :interval, :active, :stripe_price_id, :stripe_yearly_price_id, :max_users, :max_social_profiles, features: {})
    end
  end
end
