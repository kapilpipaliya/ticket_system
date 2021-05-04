class TicketsController < ApplicationController
  include Pagy::Backend

  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[index edit show update destroy]
  before_action :set_ticket, only: %i[edit show update destroy]
  before_action :check_ticket_permission, only: %i[edit show]

  # GET /tickets
  # GET /tickets.json
  def index
    if customer?
      @q = Ticket.tickets_from(current_user).ransack(params[:q]) # .order(created_at: :asc)
      @pagy, @tickets = pagy(@q.result)
      @pagy_meta = pagy_metadata(@pagy)
    elsif supporter?
      @q = Ticket.ransack(params[:q]) # .order(created_at: :asc)
      @pagy, @tickets = pagy(@q.result)
      @pagy_meta = pagy_metadata(@pagy)
    else
      @tickets = []
      @pagy_meta = {}
    end
  end

  def all_status
    render json:  status_options
  end

  def all_status_filter
    render json:  status_options_filter
  end

  def new; end

  def edit; end

  # GET /tickets/1
  # GET /tickets/1.json
  def show; end

  # POST /tickets
  # POST /tickets.json
  def create
    @ticket = Ticket.new(ticket_params)
    @ticket.current_user = current_user

    if @ticket.save
      render :show, status: :created, location: @ticket
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tickets/1
  # PATCH/PUT /tickets/1.json
  def update
    if @ticket.update(ticket_params)
      render :show, status: :ok, location: @ticket
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tickets/1
  # DELETE /tickets/1.json
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

  # Use callbacks to share common setup or constraints between actions.
  def set_ticket
    @ticket = Ticket.find(params[:id])
    @ticket.current_user = current_user
  end

  # Only allow a list of trusted parameters through.
  def ticket_params
    params.require(:ticket).permit(:subject, :description, :email, :name, :status, :creator_id, :assignee_id)
  end

  def check_ticket_permission
    render json: {'base'=>:unauthorized}, status: :unprocessable_entity if customer? && @ticket.creator_id != current_user.id
  end

  def status_options
    Ticket.statuses.map { |x, i| {'id'=>x, label: x.titleize} }
  end
  
  def status_options_filter
    Ticket.statuses.map { |x, i| {'id'=>i, label: x.titleize} }.prepend({'id'=>'', label: 'All'})
  end
end
