# Preview all emails at http://localhost:3000/rails/mailers/invitation_mailer
class InvitationMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/invitation_mailer/invite_email
  def invite_email
    InvitationMailer.invite_email
  end

end
