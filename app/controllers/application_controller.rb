class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :correct_user?

  private
    def correct_user?
      @user = User.find(params[:id])
      unless current_user == @user
        redirect_to root_url, :alert => "Access denied."
      end
    end
end
