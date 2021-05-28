module ApplicationHelper
  def react_component(name, props)
    tag.div({ id: name, data: { react_props: props } }) {}
  end
end
