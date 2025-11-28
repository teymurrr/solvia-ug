UPDATE public.discount_codes 
SET discount_value = 25,
    updated_at = now()
WHERE code = 'BLACKFRIDAY';