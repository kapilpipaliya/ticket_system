# frozen_string_literal: true

class PagesController < ApplicationController
  before_action :authenticate_user!, only: %i[dashboard]
  before_action :authorize_actions

  def index; end

  def dashboard; end

  private

  def authorize_actions
    case action_name
    when 'index', 'dashboard'
      authorize :page
    else
      raise NotImplementedError
    end
  end
end
