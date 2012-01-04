class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'gipbe'
  helper_method :correct_user?
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
end
