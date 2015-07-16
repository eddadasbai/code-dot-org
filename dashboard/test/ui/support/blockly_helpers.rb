module BlocklyHelpers
  class Point < Struct.new(:x, :y)
  end

  def drag_block_relative(block_id, dx, dy)
    @browser.execute_script("$(\"[block-id='#{block_id}']\").simulate( 'drag', {handle: 'corner', dx: #{dx}, dy: #{dy}, moves: 5});")
  end

  def generate_drag_code(from, to, target_dx, target_dy)
    generate_selector_drag_code "[block-id='#{from}']", "[block-id='#{to}']", target_dx, target_dy
  end

  def generate_selector_drag_code(from, to, target_dx, target_dy)
    "var drag_dx = $(\"#{to}\").position().left - $(\"#{from}\").position().left;" +
        "var drag_dy = $(\"#{to}\").position().top  - $(\"#{from}\").position().top;" +
        "$(\"#{from}\").simulate( 'drag', {handle: 'corner', dx: drag_dx + #{target_dx}, dy: drag_dy + #{target_dy}, moves: 5});"
  end

  def generate_begin_to_drag_code(from, to, target_dx, target_dy)
    "var drag_dx = $(\"[block-id='#{to}']\").position().left - $(\"[block-id='#{from}']\").position().left;" +
        "var drag_dy = $(\"[block-id='#{to}']\").position().top  - $(\"[block-id='#{from}']\").position().top;" +
        "$(\"[block-id='#{from}']\").simulate( 'drag', {justDrag: true, handle: 'corner', dx: drag_dx + #{target_dx}, dy: drag_dy + #{target_dy}, moves: 5});"
  end

  def get_block_coordinates(block_id)
    # For IE compatability, uses the SVG DOM binding technique from:
    #   http://stackoverflow.com/questions/10349811/how-to-manipulate-translate-transforms-on-a-svg-element-with-javascript-in-chrom
    js = "var xforms = $(\"[block-id='#{block_id}']\")[0].transform.baseVal; var firstXForm = xforms.getItem(0); if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE){ var firstX = firstXForm.matrix.e; var firstY = firstXForm.matrix.f; }; return [firstX, firstY];"
    coordinate_pair = @browser.execute_script(js)
    Point.new(coordinate_pair[0], coordinate_pair[1])
  end

  # Assign a given string block ID to a given alias
  def add_block_alias(block_alias, block_id)
    if @block_aliases.nil? then
      @block_aliases = Hash.new
    end
    @block_aliases[block_alias] = block_id
  end

  # Get the block ID for a given alias
  # Callers expect the returned block ID value to be a string
  def get_block_id(alias_or_id)
    if @block_aliases && @block_aliases.has_key?(alias_or_id)
      return @block_aliases[alias_or_id]
    end
    alias_or_id
  end
end

World(BlocklyHelpers)
