require "test_helper"

class Api::HelloControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_hello_index_url
    assert_response :success
  end
end
