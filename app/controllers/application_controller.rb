class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'gipbe'
  helper_method :correct_user?
  before_filter :set_locale
  before_filter :set_seo
  before_filter :set_bc
  #before_filter :set_locale_from_url
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, :alert => exception.message
  end

  def last_layers
    @last ||= Layer.recent_published.page(1).per(10)
  end
  helper_method :last_layers

  protected
    def set_seo(item = nil)
      unless item.nil? 
        if item.is_a? Hash
        else
          @page_title = item.respond_to?(:title) ? item.title : item.name
          @page_keywords = item.respond_to?(:tag_list) ? item.tag_list : ""
          @page_description = item.respond_to?(:description) ? item.description : ""
        end
      end
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

    def set_bc
      begin
        add_breadcrumb "Accueil", root_path
      rescue

      end
    end
end
