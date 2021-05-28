# frozen_string_literal: true

module ApplicationHelper
  def react_component(name, props)
    content_tag(:div, { id: name, data: { react_props: props } }) {}
  end
end
