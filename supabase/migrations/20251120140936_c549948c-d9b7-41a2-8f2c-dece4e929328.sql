-- Remove todas as políticas existentes da tabela Catálogo_bikes
DROP POLICY IF EXISTS "Público pode visualizar bikes disponíveis" ON public."Catálogo_bikes";
DROP POLICY IF EXISTS "Admins podem visualizar todas as bikes" ON public."Catálogo_bikes";
DROP POLICY IF EXISTS "Admins podem inserir bikes" ON public."Catálogo_bikes";
DROP POLICY IF EXISTS "Admins podem atualizar bikes" ON public."Catálogo_bikes";
DROP POLICY IF EXISTS "Admins podem deletar bikes" ON public."Catálogo_bikes";

-- Cria política para visualização pública de bikes disponíveis
CREATE POLICY "Público pode visualizar bikes disponíveis"
ON public."Catálogo_bikes"
FOR SELECT
USING (status = 'Disponível');

-- Cria política para admins terem acesso total
CREATE POLICY "Admins podem gerenciar bikes"
ON public."Catálogo_bikes"
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));