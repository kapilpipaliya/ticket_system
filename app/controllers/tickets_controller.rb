class TicketsController < ApplicationController
  include Pagy::Backend
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[index edit show update destroy]
  before_action :set_ticket, only: %i[edit show update destroy]

  # GET /tickets
  # GET /tickets.json
  def index
    if current_user.role == 'customer'
      @pagy, @tickets = pagy(Ticket.where(creator: current_user.id).order(created_at: :asc))
      @pagy_meta = pagy_metadata(@pagy)
    elsif current_user.role === 'support'
      @pagy, @tickets = pagy(Ticket.all.order(created_at: :asc))
      @pagy_meta = pagy_metadata(@pagy)
    else
      @tickets = []
      @pagy_meta = {}
    end
  end

  def all_status
    render json:  Ticket.statuses.map { |x, i| {'id'=>x, label: x.titleize} }
  end

  def new; end

  def edit
    render plain: 'Error' if current_user.role == 'customer' && @ticket.creator_id != current_user.id
  end

  # GET /tickets/1
  # GET /tickets/1.json
  def show
    render plain: 'Error' if current_user.role == 'customer' && @ticket.creator_id != current_user.id
  end

  # POST /tickets
  # POST /tickets.json
  def create
    @ticket = Ticket.new(ticket_params)
    @ticket.current_user = current_user

    if @ticket.save
      TicketMailer.with(ticket: @ticket).new_ticket_email.deliver_later
      render :show, status: :created, location: @ticket
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tickets/1
  # PATCH/PUT /tickets/1.json
  def update
    sendStatusChangeEmail = @ticket.status != params[:status]
    if @ticket.update(ticket_params)
      TicketMailer.with(ticket: @ticket).ticket_status_change_email.deliver_later if sendStatusChangeEmail
      render :show, status: :ok, location: @ticket
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tickets/1
  # DELETE /tickets/1.json
  def destroy
    if current_user.role === 'support'
      @ticket.destroy
      error = { 'error' => false }
      render json: error
    else
      error = { 'error' => 'only support member can delete ticket' }
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
end
