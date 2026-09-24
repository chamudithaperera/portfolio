export const fallbackCountryOptions = [
  'Sri Lanka',
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'United Arab Emirates',
  'Singapore',
  'Japan',
  'Malaysia',
  'New Zealand',
  'Netherlands',
  'Italy',
  'Spain',
];

export async function loadCountryOptions() {
  const response = await fetch('https://countries.dev/countries');
  if (!response.ok) {
    throw new Error('Unable to load countries.');
  }

  const countries = await response.json();
  if (!Array.isArray(countries)) {
    throw new Error('Country list is invalid.');
  }

  return countries
    .map((country) => String(country?.name || '').trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
