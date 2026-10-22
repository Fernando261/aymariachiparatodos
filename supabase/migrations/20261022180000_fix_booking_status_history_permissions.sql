-- Fix booking status history trigger permissions.
-- The function runs with its owner's privileges
-- while keeping the existing restricted search_path.
-- RLS remains enabled.

ALTER FUNCTION public.record_booking_status_history()
SECURITY DEFINER;