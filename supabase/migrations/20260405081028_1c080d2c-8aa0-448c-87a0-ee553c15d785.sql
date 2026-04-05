
CREATE TABLE public.category_groups (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.category_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view category_groups"
ON public.category_groups FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert category_groups"
ON public.category_groups FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update category_groups"
ON public.category_groups FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete category_groups"
ON public.category_groups FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_category_groups_updated_at
BEFORE UPDATE ON public.category_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.category_groups (id, name, sort_order) VALUES
  ('basic', '기본교육과정', 1),
  ('elective', '선택중심교육과정', 2);
