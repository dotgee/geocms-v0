class ContactController < ApplicationController
  def index
  end
  def post_mail
      GipbeMailer.contact(params[:contact]).deliver
      render :action => :mail_sended
     return
    begin
      puts "ok"
    rescue
      flash[:notice] = "Erreur de l'envoie veuiller verifier les champs"
      render :action => :index
    end
  end

  def mail_sended

  end

  def set_bc
    super
    add_breadcrumb "Contact", contact_path
  end
end
