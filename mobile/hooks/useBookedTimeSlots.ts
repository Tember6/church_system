import { useEffect, useState } from 'react';
import { api } from '../library/api';

export function useBookedTimeSlots(date: string, excludeRequestId?: number) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }

    let cancelled = false;

    const fetchBookedSlots = async () => {
      setLoading(true);

      try {
        const response = await api.getBookedTimeSlots(date, excludeRequestId);

        if (!cancelled) {
          if (response.success && response.data?.booked_times) {
            setBookedSlots(response.data.booked_times);
          } else {
            setBookedSlots([]);
          }
        }
      } catch (error) {
        console.error('Error fetching booked time slots:', error);
        if (!cancelled) {
          setBookedSlots([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBookedSlots();

    return () => {
      cancelled = true;
    };
  }, [date, excludeRequestId]);

  return { bookedSlots, loading };
}
