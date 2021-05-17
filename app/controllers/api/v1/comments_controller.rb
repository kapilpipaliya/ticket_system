module Api
  module V1
    class CommentsController < Api::ApiController
      before_action :authenticate_user!, only: %i[index update destroy]
      before_action :set_comment, only: %i[show update destroy]
      before_action :authorize_actions

      def index
        @comments = authorize Comment.all
      end

      def by_ticket
        ticket = Ticket.find(params[:id])
        @comments = authorize ticket.comments.includes(:commenter)
        render :index
      end

      def show; end

      def create
        @comment = authorize Comment.new(comment_params)
        if @comment.save
          render :show, status: :created, location: api_v1_comments_url(@comment)
        else
          render json: @comment.errors, status: :unprocessable_entity
        end
      end

      def update
        if @comment.update(comment_params)
          render :show, status: :ok, location: api_v1_comments_url(@comment)
        else
          render json: @comment.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @comment.destroy
        render json: @comment.errors.messages
      end

      private

      def authorize_actions
        case action_name
        when 'index', 'by_ticket', 'new', 'create'
          authorize Comment
        when 'edit', 'show', 'create', 'update', 'destroy'
          authorize @comment
        else
          raise NotImplementedError
        end
      end

      def set_comment
        @comment ||= Comment.find(params[:id])
      end

      def comment_params
        params.require(:comment).permit(:description, :ticket_id, :commenter_id)
      end
    end
  end
end
