class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'gipbe'
  before_filter :set_locale
  helper_method :correct_user?

  private

    def page
      return params[:page] || 1
    end

    def set_locale
    end

    def correct_user?
      @user = User.find(params[:id])
      unless current_user == @user
        redirect_to root_url, :alert => "Access denied."
      end
    end
end
