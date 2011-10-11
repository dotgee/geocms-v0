require 'test_helper'

class GeoContextsControllerTest < ActionController::TestCase
  setup do
    @geo_context = geo_contexts(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:geo_contexts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create geo_context" do
    assert_difference('GeoContext.count') do
      post :create, geo_context: @geo_context.attributes
    end

    assert_redirected_to geo_context_path(assigns(:geo_context))
  end

  test "should show geo_context" do
    get :show, id: @geo_context.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @geo_context.to_param
    assert_response :success
  end

  test "should update geo_context" do
    put :update, id: @geo_context.to_param, geo_context: @geo_context.attributes
    assert_redirected_to geo_context_path(assigns(:geo_context))
  end

  test "should destroy geo_context" do
    assert_difference('GeoContext.count', -1) do
      delete :destroy, id: @geo_context.to_param
    end

    assert_redirected_to geo_contexts_path
  end
end
