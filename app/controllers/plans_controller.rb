class PlansController < ApplicationController
  def index
    @plans = Plan.where(active: true)
    render json: @plans
  end

  def show
    @plan = Plan.find(params[:id])
    render json: @plan
  end
end
