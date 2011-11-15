class Admin::LayersController < ApplicationController
  before_filter :authenticate_user!
  
  def show

  end

  def index
    @layers = Layer.page(page).order('created_at desc')
  end

  def new
    @layer = Layer.new
  end

  def create
  end

  def edit
  end

  def update
  end

end
