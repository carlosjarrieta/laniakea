json.stats do
  json.total_earnings @total_earnings
end

json.payments @payments do |payment|
  json.extract! payment, :id, :amount_cents, :currency, :status, :payment_date, :created_at
  json.formatted_amount (payment.amount_cents.to_f / 100).to_s
  
  json.account do
    json.extract! payment.account, :id, :name
    json.email payment.account.billing_email || payment.account.owner&.email
  end
  
  if payment.metadata.present?
    json.invoice_url payment.metadata['hosted_invoice_url']
    json.invoice_pdf payment.metadata['pdf']
  end
end
