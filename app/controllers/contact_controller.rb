class ContactController < ApplicationController
  def index
    if request.post?
      GipbeMailer.contact(params[:contact]).deliver
      redirect_to mail_sended_contact_path
    else

    end
  end

  def mail_sended

  end
end
