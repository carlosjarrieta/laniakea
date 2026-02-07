module Superadmin
  class BaseController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_superadmin!

    private

    def ensure_superadmin!
      unless current_user.superadmin?
        render json: { error: 'Not Authorized' }, status: :forbidden
      end
    end
  end
end
