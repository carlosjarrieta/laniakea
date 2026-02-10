require 'open-uri'

class CampaignPost < ApplicationRecord
  belongs_to :campaign

  enum platform: { linkedin: 'linkedin', facebook: 'facebook', x: 'x', instagram: 'instagram', tiktok: 'tiktok', multi: 'multi' }
  enum status: { draft: 0, scheduled: 1, published: 2, failed: 3 }

  validates :content, presence: true
  validates :platform, presence: true

  has_one_attached :image

  def self.ransackable_attributes(auth_object = nil)
    ["id", "platform", "status", "content", "created_at", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["campaign"]
  end

  after_save :download_image_from_url, if: -> { image_url.present? && !image.attached? && saved_change_to_image_url? }

  def real_image_url
    return nil unless image.attached?
    Rails.application.routes.url_helpers.rails_blob_url(image, Rails.application.config.action_controller.default_url_options)
  end

  private

  def download_image_from_url
    return if image_url.blank?
    
    begin
      downloaded_image = URI.open(image_url)
      image.attach(io: downloaded_image, filename: "post_#{id}.png")
    rescue => e
      Rails.logger.error "Failed to download image for Post #{id}: #{e.message}"
    end
  end
end
