class TicketsController < ApplicationController
  include Pagy::Backend

  before_action :authenticate_user!, only: %i[index edit show update destroy]
  before_action :set_ticket, only: %i[edit show update destroy]
  before_action :check_ticket_permission, only: %i[edit show]
  before_action :authorize_actions

  def index
    @q = policy_scope(Ticket).ransack(params[:q])
    @pagy, @tickets = pagy(@q.result)
    @tickets = TicketWithAssigneeComment.new(@tickets).tickets
    @pagy_meta = pagy_metadata(@pagy)
  end

  def all_status
    render json: status_options
  end

  def all_status_filter
    render json: status_options_filter
  end

  def new; end

  def edit; end

  def show; end

  def create
    @ticket = authorize Ticket.new(ticket_params)

    if @ticket.save
      render :show, status: :created, location: @ticket
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  def update
    return user_not_authorized if customer? && !params[:assignee_id].empty? && params[:assignee_id].to_i != @ticket.assignee_id
    if @ticket.update(ticket_params)
      render :show, status: :ok, location: @ticket
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if supporter?
      @ticket.destroy
      render json: @ticket.errors.messages
    else
      error = { 'base' => 'only support member can delete ticket' }
      render json: error, status: :unprocessable_entity
    end
  end

  private

  def authorize_actions
    case action_name
    when 'index', 'all_status', 'all_status_filter', 'new', 'create'
      authorize Ticket
    when 'edit', 'show', 'create', 'update', 'destroy'
      authorize @ticket
    else
      raise NotImplementedError
    end
  end

  def set_ticket
    @ticket ||= Ticket.find(params[:id])
  end

  def ticket_params
    params.require(:ticket).permit(:subject, :description, :email, :name, :status, :creator_id, :assignee_id)
  end

  def check_ticket_permission
    user_not_authorized if customer? && @ticket.creator_id != current_user.id
  end

  def status_options
    Ticket.statuses.map { |x, i| { 'id' => x, :label => x.titleize } }
  end

  def status_options_filter
    Ticket.statuses.map { |x, i| { 'id' => i, :label => x.titleize } }.prepend({ 'id' => '', :label => 'All' })
  end
end
