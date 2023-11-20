import styled from "styled-components";
import { Transaction } from "../_data/italy-transactions";

const colors: { [key: string]: string } = {
  Hotel: "#DE5D5D",
  Rideshare: "#606060",
  Restaurants: "#77DE5D",
  Car: "#5DB7DE",
  Coffee: "#9E712C",
  Tours: "#836ED7",
  Shops: "#5DDEBF",
  "Public transportation": "#5d8cde",
  Other: "#C3BFC3",
};
const Day = styled.div`
  display: flex;
  flex-direction: column;
`;
const CategoryContainer = styled.div`
  width: 24px;
  display: flex;
  flex-direction: column;
`;

const Category = styled.div`
  height: ${({ h }: { h: number; c: string }) => h + "px"};
  background-color: ${({ c }: { h: number; c: string }) => c};
`;

interface Props {
  t: Transaction[];
  d: string;
}

export default function DayBreakdown({ t, d }: Props) {
  const categories = t.reduce(
    (acc: { [d: string]: number }, d) =>
      acc[d.category]
        ? { ...acc, [d.category]: acc[d.category] + d.amount }
        : { ...acc, [d.category]: d.amount },
    {}
  );

  return (
    <Day>
      <div>{d.substring(8)}</div>$
      {t.reduce((acc, t) => acc + t.amount, 50).toLocaleString()}
      <CategoryContainer>
        <Category h={50 / 6} c="#cccccc" title="Cash: $50" />
        {Object.keys(categories)
          .sort((a, b) => categories[b] - categories[a])
          .map((key) => (
            <Category
              key={key}
              h={categories[key] / 6}
              c={colors[key]}
              title={`${key}: $${categories[key].toLocaleString()}`}
            />
          ))}
      </CategoryContainer>
    </Day>
  );
}
