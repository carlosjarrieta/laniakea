class Ability
  include CanCan::Ability

  def initialize(user)
    return unless user.present?

    # 1. Superadmin Permissions (Global Management)
    if user.superadmin?
      can :manage, :all
      return
    end

    # 2. Account level permissions (based on Membership)
    # Note: In this app, users currently have one membership to an account.
    membership = user.membership
    return unless membership&.account.present? && membership.active?

    account = membership.account

    # Permissions for ALL members of the account
    can :read, Plan
    can :read, Account, id: account.id
    
    # Marketing Placeholders (Actions that will be implemented soon)
    # These symbols will be used to protect future controllers
    case membership.role
    when 'owner'
      # --- OWNER: FULL ACCESS ---
      # Can manage everything within the account context
      can :manage, Account, id: account.id
      can :manage, Membership, account_id: account.id
      can :manage, Invitation, account_id: account.id
      
      # Billing management (Stripe Portal, checkout, etc.)
      can :manage, :billing
      
      # Marketing Engine
      can :manage, :campaigns
      can :manage, :posts
      can :manage, :analytics

    when 'admin'
      # --- ADMIN: MANAGEMENT ACCESS ---
      # Can manage the team and content, but restricted on core account/billing
      can :update, Account, id: account.id
      can :manage, Membership, account_id: account.id
      can :manage, Invitation, account_id: account.id
      
      # Marketing Engine
      can :manage, :campaigns
      can :manage, :posts
      can :manage, :analytics
      
      # RESTRICTIONS: Cannot delete account or touch billing
      cannot :destroy, Account
      cannot :manage, :billing

    when 'member'
      # --- MEMBER: OPERATIONAL ACCESS ---
      # Can work on marketing content but not manage the organization
      can :read, Membership, account_id: account.id # See team list
      
      # Marketing Engine
      can :manage, :campaigns
      can :manage, :posts
      can :read, :analytics
      
      # RESTRICTIONS: No organization management
      cannot :manage, Membership
      cannot :manage, Invitation
      cannot :manage, :billing
      cannot :update, Account
      cannot :destroy, Account
    end
  end
end
