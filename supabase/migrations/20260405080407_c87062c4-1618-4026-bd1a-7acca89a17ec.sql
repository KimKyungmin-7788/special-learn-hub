
-- Create categories table
CREATE TABLE public.categories (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'hsl(0,0%,50%)',
  bg_color TEXT NOT NULL DEFAULT 'hsl(0,0%,95%)',
  parent TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
TO public
USING (true);

-- Admin can insert
CREATE POLICY "Admins can insert categories"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update
CREATE POLICY "Admins can update categories"
ON public.categories FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete
CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing hardcoded categories
INSERT INTO public.categories (id, name, color, bg_color, parent, sort_order) VALUES
  ('korean', '국어', 'hsl(0,75%,55%)', 'hsl(0,75%,95%)', 'basic', 1),
  ('math', '수학', 'hsl(215,80%,55%)', 'hsl(215,80%,95%)', 'basic', 2),
  ('social', '사회', 'hsl(30,85%,55%)', 'hsl(30,85%,95%)', 'basic', 3),
  ('science', '과학', 'hsl(145,60%,42%)', 'hsl(145,60%,93%)', 'basic', 4),
  ('pe', '체육', 'hsl(195,80%,55%)', 'hsl(195,80%,95%)', 'basic', 5),
  ('music', '음악', 'hsl(270,60%,58%)', 'hsl(270,60%,95%)', 'basic', 6),
  ('art', '미술', 'hsl(330,70%,62%)', 'hsl(330,70%,95%)', 'basic', 7),
  ('creative', '창의적체험활동', 'hsl(45,90%,55%)', 'hsl(45,90%,95%)', 'basic', 8),
  ('career', '진로와 직업', 'hsl(230,55%,45%)', 'hsl(230,55%,93%)', 'elective', 9),
  ('daily', '일상생활', 'hsl(90,55%,50%)', 'hsl(90,55%,93%)', 'elective', 10),
  ('tools', '업무용 앱', 'hsl(215,10%,55%)', 'hsl(215,10%,93%)', NULL, 11),
  ('curriculum', '교육과정 자료', 'hsl(25,50%,45%)', 'hsl(25,50%,93%)', NULL, 12),
  ('notice', '공지/알림', 'hsl(175,60%,42%)', 'hsl(175,60%,93%)', NULL, 13);
