class AdminAbility
  include CanCan::Ability

  def initialize(user)
    user ||= AdminUser.new
    if user.role?('super_admin')
      can :manage, :all
    else
      can :manage, :all
    end
  end
end
