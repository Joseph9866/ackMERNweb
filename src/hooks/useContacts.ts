import { useState } from 'react';
import type { ContactData } from '../utils/types';

export const useContacts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = async (contactData: ContactData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // In a real application, you would send this to your backend
      // For now, we'll simulate the submission
      console.log('Contact form submitted:', contactData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You could integrate with email services like EmailJS, Formspree, or your own backend
      // Example with EmailJS:
      // await emailjs.send('service_id', 'template_id', contactData, 'user_id');
      
      return true;
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit contact form');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContact,
    loading,
    error
  };
};