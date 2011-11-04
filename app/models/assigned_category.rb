class AssignedCategory < ActiveRecord::Base
  belongs_to :category
  belongs_to :layer, :foreign_key => :cateogrisable_id
end
