-- Update the BLACKFRIDAY discount code to have a valid expiration date
UPDATE public.discount_codes 
SET valid_until = '2025-12-06 23:59:59+00'::timestamptz,
    updated_at = now()
WHERE code = 'BLACKFRIDAY';