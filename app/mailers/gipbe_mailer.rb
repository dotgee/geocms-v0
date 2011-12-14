class GipbeMailer < ActionMailer::Base
  default from: "from@example.com"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.gipbe_mailer.contact.subject
  #
  def contact
    @greeting = "Hi"

    mail to: "to@example.org"
  end
end
