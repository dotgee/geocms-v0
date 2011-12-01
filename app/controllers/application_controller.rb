class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'gipbe'
  helper_method :correct_user?

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
end
