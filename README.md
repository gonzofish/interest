# Interest Calculator

This is a very simple interest calculator, written for Node.

## How to use

To run this, clone this repo and then run through Node or NPM.

### Via NPM

```shell
npm start -- --principle 1000 --interest 5.1 --yearly-add 500
```

### Via Node

```shell
node ./index.js --principle 1000 --interest 5.1 --yearly-add 500
```

### Options

| Description                             | Option names                                                        | Default  |
| --------------------------------------- | ------------------------------------------------------------------- | -------- |
| Set amount to be added per year (in $)  | `-a`, `--ya`, `--add`, `--yearly-add`, `--yearlyAdd`                | 0        |
| Set amount to be added per month (in $) | `--ma`, `--monthly-add`, `--monthlyAdd`                             | 0        |
| Set interest per year (as %)            | `-i`, `--yi`, `--interest`, `--yearly-interest`, `--yearlyInterest` | 4        |
| Set interest per month (as %)           | `--mi`, `--monthly-interest`, `--monthlyInterest`                   | 0.33     |
| Omit monthly output                     | `--om`, `--omit-monthly`, `--omitMonthly`                           | No value |
| Omit yearly output                      | `--oy`, `--omit-yearly`, `--omitYearly`                             | No value |
| Principle (in $)                        | `-p`, `--principle`                                                 | 0        |
| Print monthly and/or yearly intervals   | `--pi`, `--print-intervals`, `--printIntervals`                     | No value |
| Years to calculate                      | `-y`, `--year`, `--years`                                           | 10       |
