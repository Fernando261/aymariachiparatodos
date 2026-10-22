BEGIN;

-- Verifica el rol administrativo del usuario autenticado.
CREATE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'::public.app_role
  );
$$;

-- Limita la ejecución a usuarios autenticados.
REVOKE ALL ON FUNCTION private.is_admin()
FROM PUBLIC, anon;

GRANT USAGE ON SCHEMA private TO authenticated;

GRANT EXECUTE ON FUNCTION private.is_admin()
TO authenticated;

-- Los administradores pueden consultar contrataciones.
CREATE POLICY "booking requests: admins read all requests"
ON public.booking_requests
FOR SELECT
TO authenticated
USING ((SELECT private.is_admin()));

COMMIT;