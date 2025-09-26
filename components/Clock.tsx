import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const { language } = useLanguage();

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const locale = language === 'ar' ? 'ar-SA' : 'en-US';

  const timeString = date.toLocaleTimeString(locale, timeOptions);
  const dateString = date.toLocaleDateString(locale, dateOptions);

  return (
    <div className="text-center text-gray-400 text-sm hidden sm:block">
      <div>{timeString}</div>
      <div>{dateString}</div>
    </div>
  );
};

export default Clock;
