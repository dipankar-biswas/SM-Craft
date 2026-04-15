import { Star } from "lucide-react";

export const Stars = ({ rating }) => (
  <div className="flex justify-center gap-0.5 text-amber-400">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className="h-4 w-4" fill={n <= Math.round(rating) ? "currentColor" : "none"} />
    ))}
  </div>
);


export const truncateWords = (text, wordLimit) => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};


// ইংরেজি সংখ্যা থেকে বাংলা সংখ্যায় রূপান্তর
export function toBengaliNumber(str) {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
}

// বাংলা দিনের নাম
const dayNamesBn = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার',
  'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// বাংলা মাসের নাম
const monthNamesBn = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export function toBengaliDate(date, includeDay = true) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  const dayName = dayNamesBn[d.getDay()];
  const bengaliDay = toBengaliNumber(d.getDate().toString());
  const monthName = monthNamesBn[d.getMonth()];
  const bengaliYear = toBengaliNumber(d.getFullYear().toString());

  if (includeDay) {
    return `${dayName}, ${bengaliDay} ${monthName} ${bengaliYear}`;
  } else {
    return `${bengaliDay} ${monthName} ${bengaliYear}`;
  }
}

// // উদাহরণ ব্যবহার:
// console.log(toBengaliDate('Fri Feb 20 2026')); 
// // আউটপুট: "শুক্রবার, ২০ ফেব্রুয়ারি ২০২৬"

// console.log(toBengaliDate(new Date(), false)); 
// // আউটপুট: "২২ ফেব্রুয়ারি ২০২৬" (আজকের তারিখ)


// সংক্ষিপ্ত বাংলা দিনের নাম
const shortDayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];

// সংক্ষিপ্ত বাংলা মাসের নাম
const shortMonthNamesBn = [
  'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন',
  'জুলা', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'
];

export function toBengaliDateShort(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  const dayName = shortDayNamesBn[d.getDay()]; // 0 = রবি
  const bengaliDay = toBengaliNumber(d.getDate().toString());
  const monthName = shortMonthNamesBn[d.getMonth()];
  const bengaliYear = toBengaliNumber(d.getFullYear().toString());

  return `${dayName}, ${bengaliDay} ${monthName} ${bengaliYear}`;
}

// // উদাহরণ:
// console.log(toBengaliDateShort('Fri Feb 20 2026')); 
// // আউটপুট: "শুক্র, ২০ ফেব্রু ২০২৬"

// console.log(toBengaliDateShort(new Date()));
// // যেমন: "রবি, ২২ ফেব্রু ২০২৬" (আজকের তারিখ অনুযায়ী