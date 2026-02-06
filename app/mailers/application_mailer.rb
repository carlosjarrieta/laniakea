class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('SMTP_USER_NAME', "no-reply@laniakea.tech")
  layout "mailer"
end
