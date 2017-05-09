require 'capybara/rspec'
require 'capybara'
require 'capybara/dsl'
require 'selenium-webdriver'

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(
    app,
    browser: :firefox,
    desired_capabilities: Selenium::WebDriver::Remote::Capabilities.firefox(marionette: false)
  )
end

Capybara.default_driver = :selenium
Capybara.app_host = 'http://localhost:9000'
Capybara.default_max_wait_time = 5
describe "Add a new post", :type => :feature do
  it "adds a new page to the list", :js => true do
    
    visit '/'
    time = Time.now.getutc
    within(".form-fields") do
      fill_in 'postURL', with: 'martinbahier.fr'
      fill_in 'posterNick', with: time 
    end
    click_on 'Add it !'
    click_on 'List all links'
    expect(find('.postsList')).to have_content(time)
  end
end
