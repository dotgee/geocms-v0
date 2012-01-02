class AdminUser < ActiveRecord::Base

  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, 
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :last_name, :first_name, :role_id
  validates :last_name, :first_name,  :presence => true
  belongs_to :role

  def role?(role)
    return true unless role.nil?
    false
  end
end
