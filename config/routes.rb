Rails.application.routes.draw do
  devise_for :users, :path => "",
    :path_names =>  {:sign_in => "connexion", :sign_out => "logout"},
    controllers: {sessions: 'sessions'}
  root 'pages#accueil'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  resources :grilles do 
    collection do 
      post 'import' => 'grilles#import'
     
    end
  end

  get '/supp' => 'grilles#supp'

  resources :emplois do 
    collection do 
      post 'import' => 'emplois#import'
     
    end
  end

  resources :reclassements do 
    collection do 
      post 'import' => 'reclassements#import'
     
    end
  end

  resources :grades do 
    collection do 
      post 'import' => 'grades#import'
     
    end
  end
  
  post 'search_grilles', to: 'grilles#search_grilles'

  #get '/hg2et5zbk05ea', to: 'pages#index'
  get '/simulateur', to: 'pages#index'

  get '/mentions-legales', to: 'pages#mentions_legales'
  get '/donnees-personnelles', to: 'pages#donnees_personnelles'
  get '/accessibilite', to: 'pages#accessibilite'
  post 'select_filter' => 'pages#select_filter'

  get '/*path', to: 'pages#accueil'
end
