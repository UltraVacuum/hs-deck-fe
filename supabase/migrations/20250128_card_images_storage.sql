-- Create storage bucket for card images
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-images', 'card-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for storage
CREATE POLICY "Public Access to Card Images" ON storage.objects
FOR SELECT USING (bucket_id = 'card-images');

CREATE POLICY "Service Role Can Upload Card Images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'card-images' AND
  auth.role() = 'service_role'
);

CREATE POLICY "Service Role Can Update Card Images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'card-images' AND
  auth.role() = 'service_role'
);

CREATE POLICY "Service Role Can Delete Card Images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'card-images' AND
  auth.role() = 'service_role'
);