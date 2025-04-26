import { cn, getMoodColor, getMoodTrend, getMoodEmoji } from '../../lib/utils';

describe('cn function', () => {
  it('should merge class names correctly', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    expect(cn('p-4', null, undefined, 'mt-2')).toBe('p-4 mt-2');
    expect(cn('m-2', { 'text-center': true, 'font-bold': false })).toBe('m-2 text-center');
    expect(cn('flex', ['items-center', 'justify-between'])).toBe('flex items-center justify-between');
  });

  it('should handle conflicting classes with tailwind-merge', () => {
    expect(cn('px-2 py-1 p-3')).toBe('p-3');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('mt-2', 'mt-4')).toBe('mt-4');
  });
});

describe('getMoodColor function', () => {
  it('should return the correct color for each mood score range', () => {
    expect(getMoodColor(10)).toBe('green');
    expect(getMoodColor(8)).toBe('green');
    expect(getMoodColor(7)).toBe('emerald');
    expect(getMoodColor(6)).toBe('emerald');
    expect(getMoodColor(5)).toBe('amber');
    expect(getMoodColor(4)).toBe('amber');
    expect(getMoodColor(3)).toBe('orange');
    expect(getMoodColor(2)).toBe('orange');
    expect(getMoodColor(1)).toBe('red');
    expect(getMoodColor(0)).toBe('red');
  });
});

describe('getMoodTrend function', () => {
  it('should return the correct trend description for each average score range', () => {
    expect(getMoodTrend(10)).toBe("You've been feeling great!");
    expect(getMoodTrend(8)).toBe("You've been feeling great!");
    expect(getMoodTrend(7)).toBe("You've been doing well overall.");
    expect(getMoodTrend(6)).toBe("You've been doing well overall.");
    expect(getMoodTrend(5)).toBe("You've been feeling okay.");
    expect(getMoodTrend(4)).toBe("You've been feeling okay.");
    expect(getMoodTrend(3)).toBe("Things have been challenging.");
    expect(getMoodTrend(2)).toBe("Things have been challenging.");
    expect(getMoodTrend(1)).toBe("You've been having a tough time.");
    expect(getMoodTrend(0)).toBe("You've been having a tough time.");
  });
});

describe('getMoodEmoji function', () => {
  it('should return the correct emoji for each score range', () => {
    expect(getMoodEmoji(10)).toBe("😊");
    expect(getMoodEmoji(8)).toBe("😊");
    expect(getMoodEmoji(7)).toBe("🙂");
    expect(getMoodEmoji(6)).toBe("🙂");
    expect(getMoodEmoji(5)).toBe("😐");
    expect(getMoodEmoji(4)).toBe("😐");
    expect(getMoodEmoji(3)).toBe("😔");
    expect(getMoodEmoji(2)).toBe("😔");
    expect(getMoodEmoji(1)).toBe("😢");
    expect(getMoodEmoji(0)).toBe("😢");
  });
});