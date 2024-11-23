const run = () => {
  const args = parseArgs();
  const final = calculate(args);

  printMessage(args, final);
};

const parseArgs = () => {
  const [__exec, __file, ...rawArgs] = process.argv;
  const namedArgRegex = /(^|\s)(\-[a-z]|\-\-([a-z]+(\-[a-z]+)?))((=|\s)\d+)?/g;
  const matches = rawArgs.join(' ').match(namedArgRegex);
  const args = {
    omitMonthly: false,
    omitYearly: false,
    principle: 0,
    printIntervals: false,
    yearlyAdd: 0,
    yearlyInterest: 4,
    years: 10,
  };

  matches.forEach((match) => {
    const splitter = match.includes('=') ? '=' : /\s/;
    const parts = match.trim().split(splitter);
    const [arg, value] = parts;
    let normalName = getNormalizedArgName(arg);
    let normalValue = parseFloat(value);

    if (normalName === 'monthlyAdd' || normalName === 'monthlyInterest') {
      normalName = normalName.replace('monthly', 'yearly');
      normalValue = normalValue * 12;
    }

    if (normalName === 'printIntervals') {
      normalValue = true;
    }

    if (normalName === 'omitMonthly') {
      normalValue = true;
    }

    if (normalName === 'omitYearly') {
      normalValue = true;
    }

    if (normalName in args) {
      args[normalName] = normalValue;
    }
  });

  if (args.omitMonthly && args.omitYearly) {
    throw Error('Cannot omit monthly & yearly data, only one');
  }

  return args;
};

const getNormalizedArgName = (arg) => {
  const stripped = arg.replace(/^\-+/, '');

  switch (stripped) {
    case 'a':
    case 'add':
    case 'yearly-add':
    case 'ya':
      return 'yearlyAdd';
    case 'i':
    case 'interest':
    case 'yi':
    case 'yearly-interest':
      return 'yearlyInterest';
    case 'ma':
    case 'monthly-add':
      return 'monthlyAdd';
    case 'mi':
    case 'monthly-interest':
      return 'monthlyInterest';
    case 'om':
    case 'omit-monthly':
      return 'omitMonthly';
    case 'oy':
    case 'omit-yearly':
      return 'omitYearly';
    case 'p':
      return 'principle';
    case 'pi':
    case 'print-intervals':
      return 'printIntervals';
    case 'y':
    case 'year':
      return 'years';
    default:
      return stripped;
  }
};

const calculate = ({ principle, yearlyAdd, yearlyInterest, years }) => {
  const monthlyAdd = yearlyAdd / 12;
  const interest = yearlyInterest / 100;
  const monthlyInterest = interest / 12;
  const months = years * 12;
  const monthlyIncrease = 1 + monthlyInterest;
  const yearlyIncrease = 1 + interest;
  const monthly = { intervals: [], total: principle };
  const yearly = { intervals: [], total: principle };

  for (let i = 0; i < months; i += 1) {
    monthly.total *= monthlyIncrease;
    monthly.total += monthlyAdd;
    monthly.intervals.push(monthly.total);

    yearly.total += monthlyAdd;

    if ((i + 1) % 12 === 0) {
      yearly.total *= yearlyIncrease;
      yearly.intervals.push(yearly.total);
    }
  }

  return { monthly, yearly };
};

const printMessage = (args, final) => {
  const { principle, printIntervals, yearlyAdd, yearlyInterest, years } = args;
  const separator = '-------------';
  const narrative = [
    `Principle: ${formatMoney(principle)}`,
    `Add/month: ${formatMoney(yearlyAdd / 12)}`,
  ];

  if (args.omitMonthly) {
    narrative.push(
      `Yearly interest: ${yearlyInterest}%`,
      `Years: ${years}`,
      separator,
      `Final (yearly): ${formatMoney(final.yearly.total)}`
    );
  } else if (args.omitYearly) {
    narrative.push(
      `Monthly interest: ${roundMoney(yearlyInterest / 12)}%`,
      `Months: ${years * 12}`,
      separator,
      `Final (monthly): ${formatMoney(final.monthly.total)}`
    );
  } else {
    narrative.push(
      `Yearly interest: ${yearlyInterest}%`,
      `  Compounded monthly @ ${roundMoney(yearlyInterest / 12)}%`,
      `Add/month: ${formatMoney(yearlyAdd / 12)}`,
      `Years: ${years}`,
      `  Months: ${years * 12}`,
      separator,
      `Final (monthly): ${formatMoney(final.monthly.total)}`,
      `Final (yearly): ${formatMoney(final.yearly.total)}`
    );
  }

  if (printIntervals) {
    if (!args.omitMonthly) {
      narrative.push(
        '',
        '',
        'Monthly intervals',
        separator,
        ...formatIntervals(final.monthly.intervals)
      );
    }

    if (!args.omitYearly) {
      narrative.push(
        '',
        '',
        'Yearly intervals',
        separator,
        ...formatIntervals(final.yearly.intervals)
      );
    }
  }

  console.log(narrative.join('\n'));
};

const formatIntervals = (intervals) =>
  intervals.map((value, i) => `${i + 1}: ${formatMoney(value)}`);

const formatMoney = (value) => {
  const formatter = Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  });

  return formatter.format(roundMoney(value));
};
const roundMoney = (value) => Math.floor(value * 100) / 100;

run();
