require "test_helper"

class GrillesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get grilles_index_url
    assert_response :success
  end
end
