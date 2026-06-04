import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface KeywordProps {
  onStepComplete: (who: string, where: string) => void;
}

const whoKeywords = [
  "엄마와",
  "아빠와",
  "형/오빠와",
  "누나/언니와",
  "친구와",
  "혼자",
];

const whereKeywords = ["집에서", "유치원에서", "놀이터에서", "야외에서"];

export default function Keyword({ onStepComplete }: KeywordProps) {
  const [selectedWho, setSelectedWho] = useState<string | null>(null);
  const [selectedWhere, setSelectedWhere] = useState<string | null>(null);

  const hasCalledRef = useRef(false); // ✅ 한 번만 실행되도록 제어

  useEffect(() => {
    if (selectedWho && selectedWhere && !hasCalledRef.current) {
      onStepComplete(selectedWho, selectedWhere);
      hasCalledRef.current = true; // ✅ 다시 실행되지 않도록 설정
    }
  }, [selectedWho, selectedWhere, onStepComplete]);

  return (
    <Wrapper>
      <StepTitle>1. 누구와 함께 하나요?</StepTitle>
      <KeywordGroup>
        {whoKeywords.map((kw) => (
          <KeywordButton
            key={kw}
            selected={selectedWho === kw}
            onClick={() => setSelectedWho(kw)}
          >
            {kw}
          </KeywordButton>
        ))}
      </KeywordGroup>

      {selectedWho && (
        <>
          <StepTitle>2. 어디에서 놀이하나요?</StepTitle>
          <KeywordGroup>
            {whereKeywords.map((kw) => (
              <KeywordButton
                key={kw}
                selected={selectedWhere === kw}
                onClick={() => setSelectedWhere(kw)}
              >
                {kw}
              </KeywordButton>
            ))}
          </KeywordGroup>
        </>
      )}

      {selectedWho && selectedWhere && (
        <Summary>
          선택한 키워드: <strong>{selectedWho}</strong> /{" "}
          <strong>{selectedWhere}</strong>
        </Summary>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const StepTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 8px;
`;

const KeywordGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const KeywordButton = styled.button<{ selected?: boolean }>`
  background-color: ${({ selected }) => (selected ? "#00ada9" : "#e0e0e0")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  border: none;
  cursor: pointer;
`;

const Summary = styled.div`
  font-size: 14px;
  color: #333;
  margin-top: 12px;
`;
