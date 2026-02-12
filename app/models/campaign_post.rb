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

  def as_json(options = {})
    super(options).merge({
      'real_image_url' => real_image_url,
      'metrics' => metrics || {}
    })
  end

  def publish_to_facebook!(page_id, page_access_token)
    return false unless facebook?
    
    graph = Koala::Facebook::API.new(page_access_token)
    
    if image.attached?
      # Subimos el archivo directamente. Usamos el blob para obtener el content_type 
      # y asegurar que Facebook lo acepte correctamente.
      result = image.open do |file|
        graph.put_picture(file, { 
          message: content, 
          content_type: image.blob.content_type 
        }, page_id)
      end
    else
      # Publicar solo texto
      result = graph.put_connections(page_id, 'feed', message: content)
    end

    if result['id']
      update!(
        status: :published, 
        metadata: (metadata || {}).merge(
          facebook_post_id: result['id'], 
          published_at: Time.current,
          page_id: page_id,
          page_access_token: page_access_token # Store token for metrics fetching
        )
      )
      true
    else
      update!(status: :failed)
      false
    end
  rescue => e
    Rails.logger.error "FACEBOOK PUBLISH ERROR: #{e.message}"
    update!(status: :failed, metadata: (metadata || {}).merge(last_error: e.message))
    raise e
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
