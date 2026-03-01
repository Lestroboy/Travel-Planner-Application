export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString, format = "short") => {
  const date = new Date(dateString);
  const options = {
    short: { month: "short", day: "numeric" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "short", month: "short", day: "numeric", year: "numeric" },
  };
  return date.toLocaleDateString("en-IN", options[format]);
};

export const formatTime = (timeString) => {
  if (!timeString) return "--:--";
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays}N/${diffDays + 1}D`;
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
};

export const getStatusColor = (status) => {
  const colors = {
    upcoming: "bg-secondary/10 text-secondary",
    ongoing: "bg-accent-green/10 text-accent-green",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return colors[status] || colors.upcoming;
};

export const getBudgetStatus = (spent, total) => {
  const percentage = (spent / total) * 100;
  if (percentage >= 90) return { color: "text-destructive", bg: "bg-destructive", status: "critical" };
  if (percentage >= 70) return { color: "text-accent-orange", bg: "bg-accent-orange", status: "warning" };
  return { color: "text-accent-green", bg: "bg-accent-green", status: "healthy" };
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
};

export const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage:`, error);
  }
};

export const simulateApiCall = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const filterByPriceRange = (items, min, max) => {
  return items.filter((item) => item.price >= min && item.price <= max);
};

export const sortItems = (items, sortBy, order = "asc") => {
  return [...items].sort((a, b) => {
    if (order === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });
};

export const groupByDate = (items) => {
  return items.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};
