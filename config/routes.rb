Geocms::Application.routes.draw do
  get "group_projects/show"

  match "sitemap", :controller => :sitemap, :action => :sitemap

  get "tag/:id", :as => :tag, :controller => :tag, :action => :show

  ActiveAdmin.routes(self)
  mount Ckeditor::Engine => '/ckeditor'
  
  resources :group_projects, :path => "groupe_de_projets", :only => :show
  resources :contact, :path_names => { :index => :contact }, :via => [:get, :post], :only => [:index, :mail_sende] do
    collection do
      match "mail_sended"
      post "post_mail"
    end
  end

  devise_for :admin_users, ActiveAdmin::Devise.config

  match '/gc/:key' => "geo_contexts#permalink", :as => :gc_permalink
  match '/gc/:name/:key' => "geo_contexts#download", :as => :gc_download

  get "rss/layers" => "rss#layers", :as => :rss

  #resources :taxonomies

  resources :taxons, :only => :show

  resources :layers, :only => [:show, :index, :search, :wfs]  do
    collection do
      get 'print'
      match "search"
    end
    member do
      get 'find'
      get 'external'
      get 'getfeatures'
      get 'get_javascript'
      get 'wfs'
    end
  end

  resources :geo_contexts, :only => [:show, :index]  do
    member do
      get 'permalink_map'
      get 'external'
    end
    collection do 
      get 'wmc'
      post 'post'
      post 'load'
      match 'print_img'
    end
  end


  match '/auth/failure' => 'devise/sessions#failure'

  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
  end

  devise_for :users

  #get \"users\/show\"

  resources :users, :only => [ :show, :edit, :update ]

  match '/auth/:provider/callback' => 'sessions#create'


  root :to => "home#index"
  match "/:id(.:format)", :controller => "pages", :action => :show, :as => :page
end
