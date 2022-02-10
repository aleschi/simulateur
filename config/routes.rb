Rails.application.routes.draw do
  root 'pages#index'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  resources :grilles do 
    collection do 
      post 'import' => 'grilles#import'
     
    end
  end

  resources :emplois do 
    collection do 
      post 'import' => 'emplois#import'
     
    end
  end
  
  post 'search_grilles', to: 'grilles#search_grilles'

  get '/*path', to: 'pages#index'

  get 'mentions-legales', to: 'pages#mentions_legales'
  get 'donnees-personnelles', to: 'pages#donnees_personnelles'
  get 'accessibilite', to: 'pages#accessibilite'
  post 'select_filter' => 'pages#select_filter'
end
