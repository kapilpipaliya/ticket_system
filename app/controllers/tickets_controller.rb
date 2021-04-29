class TicketsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[ index show update destroy ]
  before_action :set_ticket, only: %i[ show update destroy ]

  # GET /tickets
  # GET /tickets.json
  def index
    if current_user.role == "customer"
      @tickets = Ticket.all # cheeck logged in using api and pass current user and save on db
    elsif current_user.role === "admin"
      @tickets = Ticket.all
    else
      @tickets = []
    end
  end
  def new
  end
  def edit
  end
  # GET /tickets/1
  # GET /tickets/1.json
  def show
  end

  # POST /tickets
  # POST /tickets.json
  def create
    @ticket = Ticket.new(ticket_params)

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
    @ticket.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ticket
      @ticket = Ticket.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def ticket_params
      params.require(:ticket).permit(:subject, :description, :email_of_submitter, :name_of_submitter)
    end
end
