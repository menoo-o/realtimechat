// Helper function to split full_name
export default function splitName(fullName?: string): { firstName: string; lastName: string } {
    if (!fullName || typeof fullName !== 'string') {
      return { firstName: 'Unknown', lastName: 'Unknown' };
    }
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: 'Unknown' };
    }
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' ') || 'Unknown',
    };
  }

