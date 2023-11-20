import styled from "styled-components";

import Head from "../../components/head";
import Header from "../../components/header";
import { Article, Main } from "../../components";
import { Transaction, transactions } from "../../_data/italy-transactions";
import DayBreakdown from "../../components/day-breakdown";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 32px;
  width: 100%;
`;

export default function Italy() {
  const dates = transactions
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .reduce(
      (acc: { [d: string]: Transaction[] }, t) =>
        acc[t.date]
          ? { ...acc, [t.date]: [...acc[t.date], t] }
          : { ...acc, [t.date]: [t] },
      {}
    );
  const categories = transactions.reduce(
    (acc: { [c: string]: number }, t) =>
      acc[t.category]
        ? { ...acc, [t.category]: acc[t.category] + t.amount }
        : { ...acc, [t.category]: t.amount },
    {}
  );
  return (
    <>
      <Head title="Italy - Sam Swanke" />
      <Header />

      <Main>
        <Article>
          <div>
            Total Cost: $
            {transactions
              .reduce((acc, t) => acc + t.amount, 0)
              .toLocaleString()}
          </div>
          <div>Spending by Category:</div>
          <div>
            <div>Cash: $1,400.00</div>
            {Object.keys(categories)
              .sort((a, b) => categories[b] - categories[a])
              .map((key) => (
                <div key={key}>
                  {key}: ${categories[key].toLocaleString()}
                </div>
              ))}
          </div>
          <Grid>
            <div />
            <div />
            <div />
            <div />
            <div />
            {Object.keys(dates).map((date, idx) => (
              <DayBreakdown key={"breakdown" + idx} t={dates[date]} d={date} />
            ))}
          </Grid>
        </Article>
      </Main>
    </>
  );
}
