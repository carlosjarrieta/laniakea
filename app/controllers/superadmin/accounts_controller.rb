class Superadmin::AccountsController < Superadmin::BaseController
  def index
    @accounts = Account.all.includes(:plan, :owner)
    render json: @accounts.as_json(include: { 
      plan: { only: [:id, :name] },
      owner: { only: [:id, :name, :email] }
    })
  end

  def show
    @account = Account.find(params[:id])
    render json: @account.as_json(include: [:plan, :users, :memberships])
  end

  def update
    @account = Account.find(params[:id])
    if @account.update(account_params)
      render json: @account
    else
      render json: { errors: @account.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def account_params
    params.require(:account).permit(:name, :status, :plan_id)
  end
end
