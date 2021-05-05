class CommentsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[index update destroy]
  before_action :set_comment, only: %i[show update destroy]

  # GET /comments
  # GET /comments.json
  def index
    @comments = authorize Comment.all
  end

  def by_ticket
    ticket = Ticket.find(params[:id])
    @comments = authorize ticket.comments
    render :index
  end

  # GET /comments/1
  # GET /comments/1.json
  def show
    authorize @ticket
  end

  # POST /comments
  # POST /comments.json
  def create
    @comment = authorize Comment.new(comment_params)
    if @comment.save
      render :show, status: :created, location: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  # PATCH/PUT /comments/1.json
  def update
    authorize @comment
    if @comment.update(comment_params)
      render :show, status: :ok, location: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /comments/1
  # DELETE /comments/1.json
  def destroy
    authorize @comment
    @comment.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_comment
    @comment = Comment.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def comment_params
    params.require(:comment).permit(:title, :description, :ticket_id, :commenter_id)
  end
end
