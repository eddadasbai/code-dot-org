# == Schema Information
#
# Table name: parent_levels_child_levels
#
#  id              :integer          not null, primary key
#  parent_level_id :integer          not null
#  child_level_id  :integer          not null
#  position        :integer
#
# Indexes
#
#  index_parent_levels_child_levels_on_child_level_id   (child_level_id)
#  index_parent_levels_child_levels_on_parent_level_id  (parent_level_id)
#

class ParentLevelsChildLevel < ActiveRecord::Base
end
