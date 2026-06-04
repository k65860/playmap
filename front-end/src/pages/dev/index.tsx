import styled from "styled-components";
import Input from "../../layouts/input";
import { useState } from "react";

export default () => {
  const [value, setValue] = useState<number>(0);

  return (
    <>
      개발용 페이지
      <br />
      <br />
      <br />
      <div style={{ margin: 40 }}>
        <Input
          type="number"
          value={value}
          onChange={(val) => setValue(Number(val))}
          min={1}
          max={10}
        />
      </div>
    </>
  );
};
const Container = styled.main``;
