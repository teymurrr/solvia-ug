-- Insert Black Friday 20% discount code valid until next week
INSERT INTO public.discount_codes (
  code,
  discount_type,
  discount_value,
  applicable_products,
  is_active,
  valid_from,
  valid_until
) VALUES (
  'BLACKFRIDAY',
  'percentage',
  20,
  ARRAY['homologation', 'language_prep', 'premium_support'],
  true,
  now(),
  '2024-12-06 23:59:59+00'
) ON CONFLICT (code) DO UPDATE SET
  discount_value = 20,
  is_active = true,
  valid_until = '2024-12-06 23:59:59+00';