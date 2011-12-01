Geocms::Application.routes.draw do
  
  ActiveAdmin.routes(self)

  devise_for :admin_users, ActiveAdmin::Devise.config

  match '/gc/:key' => "geo_contexts#permalink", :as => :gc_permalink

  get "rss/layers"

  #resources :taxonomies

  #resources :taxons

  resources :layers do
    collection do
      get 'print'
      match "search"
    end
  end

  #resources :categories

  resources :geo_contexts do
    member do
      get 'permalink_map'
    end
    collection do 
      get 'wmc'
      post 'post'
    end
  end

  #mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'

  match '/auth/failure' => 'devise/sessions#failure'

  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
  end

  devise_for :users

  #get \"users\/show\"

  resources :users, :only => [ :show, :edit, :update ]

  match '/auth/:provider/callback' => 'sessions#create'


  root :to => "home#index"
end
