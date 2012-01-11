class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'gipbe'
  helper_method :correct_user?
  before_filter :set_locale
  #before_filter :set_locale_from_url
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, :alert => exception.message
  end

  private
    def page
      return params[:page] || 1
    end


    def correct_user?
      @user = User.find(params[:id])
      unless current_user == @user
        redirect_to root_url, :alert => "Access denied."
      end
    end

    def render_404
      render :file => "#{Rails.root}/public/404.html", :status => :not_found
    end

    def set_locale
      I18n.locale = "fr" || params[:locale] || ((lang = request.env['HTTP_ACCEPT_LANGUAGE']) && lang[/^[a-z]{2}/])
    end
end
