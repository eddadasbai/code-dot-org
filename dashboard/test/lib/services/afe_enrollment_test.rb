require 'test_helper'

class Services::AFEEnrollmentTest < ActiveSupport::TestCase
  FAKE_FORM_URL = 'https://example.com/testform'

  def setup
    CDO.stubs(:afe_pardot_form_handler_url).returns(FAKE_FORM_URL)
  end

  test 'submit does nothing if configuration is missing' do
    CDO.unstub(:afe_pardot_form_handler_url)
    CDO.stubs(:afe_pardot_form_handler_url).returns(nil)
    Net::HTTP.expects(:post_form).never
    Services::AFEEnrollment.new.submit(valid_test_params)
  end

  test 'submit posts to Pardot with the expected format' do
    Timecop.freeze do
      expected_request = Net::HTTP.expects(:post_form).with do |uri, params|
        uri.to_s == FAKE_FORM_URL && params.to_h == {
          'traffic-source' => 'AFE-code.org-test',
          'first-name' => 'test-first-name',
          'last-name' => 'test-last-name',
          'email' => 'test-email',
          'nces-id' => '012345678901',
          'street-1' => 'test-street-1',
          'street-2' => 'test-street-2',
          'city' => 'test-city',
          'state' => 'test-state',
          'zip' => 'test-zip',
          'inspirational-marketing-kit' => '1',
          'csta-plus' => '1',
          'aws-educate' => '1',
          'amazon-terms' => '1',
          'new-code-account' => '1',
          'registration-date-time' => Time.now.iso8601
        }
      end
      expected_request.returns(fake_success_response)

      Services::AFEEnrollment.new.submit(valid_test_params)
    end
  end

  test 'false becomes "0" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '0'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: false))
  end

  test 'the string "false" becomes "0" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '0'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: 'false'))
  end

  test 'the number 0 becomes "0" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '0'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: 0))
  end

  test 'the string "0" becomes "0" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '0'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: '0'))
  end

  test 'true becomes "1" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '1'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: true))
  end

  test 'the string "true" becomes "1" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '1'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: 'true'))
  end

  test 'the number 1 becomes "1" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '1'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: 1))
  end

  test 'the string "1" becomes "1" for boolean params' do
    expected_request = Net::HTTP.expects(:post_form).with do |_, params|
      params['aws-educate'] == '1'
    end
    expected_request.returns(fake_success_response)

    Services::AFEEnrollment.new.submit(valid_test_params.merge(aws_educate: '1'))
  end

  test 'raises without submitting if amazon_terms is not true' do
    Net::HTTP.expects(:post_form).never
    assert_raises_matching /AFE submission skipped: Terms and conditions were not accepted/ do
      Services::AFEEnrollment.new.submit(valid_test_params.merge(amazon_terms: false))
    end
  end

  test 'submit raises when Pardot response is a failure status' do
    Net::HTTP.stubs(:post_form).returns(fake_unavailable_response)
    assert_raises_matching /AFE submission failed with HTTP 503/ do
      Services::AFEEnrollment.new.submit(valid_test_params)
    end
  end

  test 'submit raises when Pardot response is a validation failure' do
    Net::HTTP.stubs(:post_form).returns(fake_validation_failure_response)
    assert_raises_matching /AFE submission failed with a validation error/ do
      Services::AFEEnrollment.new.submit(valid_test_params)
    end
  end

  private

  def valid_test_params
    {
      traffic_source: 'AFE-code.org-test',
      first_name: 'test-first-name',
      last_name: 'test-last-name',
      email: 'test-email',
      nces_id: '012345678901',
      street_1: 'test-street-1',
      street_2: 'test-street-2',
      city: 'test-city',
      state: 'test-state',
      zip: 'test-zip',
      marketing_kit: true,
      csta_plus: true,
      aws_educate: true,
      amazon_terms: true,
      new_code_account: true
    }
  end

  def fake_success_response
    mock.tap do |response|
      response.stubs(:status).returns(200)
      response.stubs(:body).returns(<<~BODY)
        Cannot find success page to redirect to. Please use your browser back button.
      BODY
    end
  end

  def fake_validation_failure_response
    mock.tap do |response|
      # This reflects the actual behavior of the Pardot form handler: It returns a
      # 200 when a validation failure occurs.
      response.stubs(:status).returns(200)
      response.stubs(:body).returns(<<~BODY)
        Cannot find error page to redirect to. Please use your browser back button.
        Please correct the following errors:~~~ - This field is required~~~
      BODY
    end
  end

  def fake_unavailable_response
    mock.tap do |response|
      response.stubs(:status).returns(503)
    end
  end
end
