class MembershipsController < ApplicationController
  before_action :authenticate_user!, except: [:show_invitation]
  authorize_resource instance_name: :membership, except: [:show_invitation]

  def index
    account = current_user.account
    memberships = account.memberships.includes(:user)
    invitations = account.invitations.where(accepted_at: nil)

    render json: {
      memberships: memberships.as_json(include: :user),
      invitations: invitations
    }
  end

  def invite
    invitation = current_user.account.invitations.new(invitation_params)
    authorize! :create, invitation

    if invitation.save
      InvitationMailer.invite_email(invitation).deliver_later
      render json: { message: "Invitación enviada con éxito.", invitation: invitation }, status: :created
    else
      render json: { errors: invitation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    membership = current_user.account.memberships.find(params[:id])
    # The Ability class handles the check, but we can double-check for owners here as a business rule
    if membership.owner?
      render json: { error: "No se puede eliminar al dueño de la cuenta." }, status: :unprocessable_entity
    else
      membership.destroy
      render json: { message: "Miembro eliminado con éxito." }
    end
  end

  def cancel_invitation
    invitation = current_user.account.invitations.find(params[:id])
    authorize! :destroy, invitation
    
    invitation.destroy
    render json: { message: "Invitación cancelada con éxito." }
  end

  def show_invitation
    invitation = Invitation.find_by!(token: params[:token])
    render json: {
      email: invitation.email,
      account_name: invitation.account.name,
      role: invitation.role
    }
  end

  private

  def invitation_params
    params.require(:invitation).permit(:email, :role)
  end
end
