class GipbeMailer < ActionMailer::Base

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.gipbe_mailer.contact.subject
  #
  def contact(params)
    @message = params.delete(:message)
    @full_name = "#{params.delete(:last_name)} #{params.delete(:first_name)}"
    mail to: AppConfig.contact_email, 
         from: params.delete(:email) do |format|
            format.html
         end
  end
end
