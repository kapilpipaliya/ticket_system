# frozen_string_literal: true

class TicketsController < ApplicationController
  include Pagy::Backend

  before_action :authenticate_user!, only: %i[index edit show update destroy]
  before_action :set_ticket, only: %i[edit show update destroy]
  before_action :check_ticket_permission, only: %i[edit show]
  before_action :authorize_actions

  def index; end

  def new; end

  def edit; end

  def show; end

  private

  def authorize_actions
    case action_name
    when 'index', 'new'
      authorize Ticket
    when 'edit', 'show'
      authorize @ticket
    else
      raise NotImplementedError
    end
  end

  def set_ticket
    @ticket ||= Ticket.find(params[:id])
  end

  def check_ticket_permission
    user_not_authorized if customer? && @ticket.creator_id != current_user.id
  end
end
