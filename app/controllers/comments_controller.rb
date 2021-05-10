class CommentsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[index update destroy]
  before_action :set_comment, only: %i[show update destroy]

  def index
    @comments = authorize Comment.all
  end

  def by_ticket
    ticket = Ticket.find(params[:id])
    @comments = authorize ticket.comments.includes(:commenter)
    render :index
  end

  def show
    authorize @ticket
  end

  def create
    @comment = authorize Comment.new(comment_params)
    if @comment.save
      render :show, status: :created, location: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def update
    authorize @comment
    if @comment.update(comment_params)
      render :show, status: :ok, location: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @comment
    @comment.destroy
    render json: @comment.errors.messages
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:description, :ticket_id, :commenter_id)
  end
end
