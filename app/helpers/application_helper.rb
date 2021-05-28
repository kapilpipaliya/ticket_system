# frozen_string_literal: true

module ApplicationHelper
  def react_component(name, props)
    content_tag(:div, { id: name, data: { react_props: props } }) {}
  end
  def routes
    {
      profile: profile_api_v1_users_path,
      users: api_v1_users_path,
      all_status: all_status_api_v1_tickets_path,
      all_status_filter: all_status_filter_api_v1_tickets_path,
      sentiments_options_filter: sentiments_options_filter_api_v1_tickets_path,
      tickets: api_v1_tickets_path,
      ticket: api_v1_ticket_path(':id'),
      comments_by_ticket: by_ticket_api_v1_comment_path(':id'),
      comments: api_v1_comments_path,
      comment: api_v1_comment_path(':id'),
      dashboard_data: data_api_v1_dashboard_index_path,
      dashboard_static_data: static_api_v1_dashboard_index_path,
      latest_activity: latest_activity_api_v1_logs_path,
    }
  end
end
