class InvitationMailer < ApplicationMailer
  def invite_email(invitation)
    @invitation = invitation
    @account = invitation.account
    frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:3001'
    @url = "#{frontend_url}/signup?token=#{@invitation.token}"
    
    mail(to: @invitation.email, subject: "Has sido invitado a unirte a #{@account.name} en Laniakea")
  end
end
